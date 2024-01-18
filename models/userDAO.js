/* eslint-disable camelcase */
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_USER_URL,
  port: process.env.DB_USER_PORT,
  user: process.env.DB_USER_USER,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_USER_DATABASE,
  connectionLimit: 10,
});
if (pool) console.log(`database connected...`);

const sql = {
  checkId: 'SELECT * FROM user WHERE email = ?',
  userId: `SELECT user_id, name, nickname, email, updated_at, point, birthday, tel FROM user WHERE user_id = ?`,
  checkNickname: 'SELECT * FROM user WHERE nickname = ?',
  signup: 'INSERT INTO user(name, nickname, email, password, birthday, tel) VALUES(?, ?, ?, ?, ?, ?)',
  login: 'SELECT * FROM user WHERE email = ? AND password = ?',
  updatedAt: 'UPDATE user SET updated_at = NOW() WHERE email = ?',
  update: 'UPDATE user SET password = ? WHERE email = ?',
  delete: 'DELETE FROM user WHERE email = ?',
  updatePoint: 'UPDATE user SET point = ? WHERE user_id = ?',
};

const userDAO = {
  checkId: async (item, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [resp] = await conn.query(sql.checkId, item.email);

      if (resp[0]) callback({ status: 500, message: '사용자가 존재합니다', data: { name: resp[0].name, email: resp[0].email } });
      else callback({ status: 200, message: '사용자가 존재하지않습니다' });
    } catch (error) {
      callback({ status: 500, message: '유저 입력 실패', error });
    } finally {
      if (conn !== null) conn.release(); 
    }
  },

  userId: async (item, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();
  
      const [resp] = await conn.query(sql.userId, [item.user_id]);
  
      if (resp[0]) {
        callback({ status: 500, message: '사용자가 존재합니다', data: resp[0] });
      } else callback({ status: 200, message: '사용자가 존재하지않습니다'});
    } catch (error) {
      callback({ status: 500, message: '유저 입력 실패', error });
    } finally {
      if (conn !== null) conn.release(); 
    }
  },

  checkNickname: async (item, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [resp] = await conn.query(sql.checkNickname, item.nick);

      if (resp[0]) callback({ status: 500, message: '사용자가 존재합니다.', data: { name: resp[0].name, email: resp[0].email } });
      else callback({ status: 200, message: '사용자가 존재하지않습니다' });
    } catch (error) {
      callback({ status: 500, message: '유저 입력 실패', error });
    } finally {
      if (conn !== null) conn.release(); // DB 접속 해제
    }
  },

  signup: async (item, callback) => {
    const { name, nickname, email, password, birthday, tel } = item;

    let conn = null;
    try {
      conn = await pool.getConnection(); 

      const [respCheck] = await conn.query(sql.checkId, email);
      if (respCheck[0]) {
        callback({ status: 409, message: '중복된 이메일이 존재합니다', data:
         { name: respCheck[0].name,  nickname: respCheck[0].nickname, email: respCheck[0].email, birthday: respCheck[0].birthday, tel: respCheck[0].tel } });
      } else{

        const [respCheckNickname] = await conn.query(sql.checkNickname, nickname);
        if (respCheckNickname[0]) {
          callback({ status: 408, message: '중복된 닉네임이 존재합니다', data:
        { name: respCheckNickname[0].name,  nickname: respCheckNickname[0].nickname, email: respCheckNickname[0].email, birthday: respCheckNickname[0].birthday, tel: respCheckNickname[0].tel } });
      } else {
        const salt = await bcrypt.genSalt();
        bcrypt.hash(password, salt, async (error, hash) => {
          if (error) callback({ status: 500, message: '암호화 실패', error: error });
          else {
            const [resp] = await conn.query(sql.signup, [name, nickname, email, hash, birthday, tel]);
            callback({ status: 200, message: 'OK', data: resp });
          }
        });
      }
    }
    } catch (error) {
      callback({ status: 500, message: '유저 입력 실패', error: error });
    } finally {
      if (conn !== null) conn.release(); 
    }
  },

  login: async (item, callback) => {
    const { email, password } = item;

    let conn = null;
    try {
      conn = await pool.getConnection();

      const [user] = await conn.query(sql.checkId, [email]);
      if (!user[0]) {
        callback({ status: 500, message: '아이디, 패스워드를 확인해주세요' });
      } else {
        bcrypt.compare(password, user[0].password, async (error, result) => {
          if (error) callback({ status: 500, message: '아이디, 패스워드를 확인해주세요', error });
          else if (result) {
            callback({ status: 200, message: 'OK', data: { name: user[0].name, email: user[0].email, id: user[0].user_id, nickname: user[0].nickname, point: user[0].point, birthday: user[0].birthday ,tel: user[0].tel  } });
          } else {
            callback({ status: 500, message: '아이디, 패스워드를 확인해주세요' });
          }
        })

      }

    } catch (error) {
      callback({ status: 500, message: '로그인 실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },

  update: async (item, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();

      const salt = await bcrypt.genSalt();
      bcrypt.hash(item.password, salt, async (error, hash) => {
        if (error) callback({ status: 500, message: '암호화 실패', error: error });
        else {
          const [resp] = await conn.query(sql.update, [hash, item.email]);
          await pool.query(sql.updatedAt, [item.email]);
          conn.commit();   

          callback({ status: 200, message: 'OK', data: resp });
        }
      });
    } catch (error) {
      conn.rollback(); 
      callback({ status: 500, message: '업데이트 실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },
  delete: async (item, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();

      const [resp] = await pool.query(sql.delete, [item.email]);
      conn.commit();    

      callback({ status: 200, message: 'OK', data: resp });
    } catch (error) {
      conn.rollback();  
      callback({ status: 500, message: '유저 삭제 실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },

  updatePoint: async (item, callback) => {
    const { point, user_id } = item
    let conn = null;

    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();

      await conn.query(sql.updatePoint, [point, user_id]);
      const [updatedUser] = await conn.query(sql.userId, [user_id]);
      conn.commit();   

      callback({ status: 200, message: 'OK', data: { name: updatedUser[0].name, email: updatedUser[0].email, id: updatedUser[0].user_id, nickname: updatedUser[0].nickname, point: updatedUser[0].point, birthday: updatedUser[0].birthday ,tel: updatedUser[0].tel  } });
    } catch (error) {
      conn.rollback();
      callback({ status: 500, message: '포인트 업데이트 실패', error });
    } finally {
      if (conn !== null) conn.release();
    }
  },
  
};

module.exports = userDAO;