/* eslint-disable camelcase */
const mysql = require('mysql2/promise');
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
  createSellList: 'INSERT INTO sell(product_id, user_id) VALUES (?, ?)',
  getSellList: `SELECT p.name, p.cost_price, p.sale_price, p.state, p.ex_date, p.barcode, p.like_count, p.sale, u.name as seller_name 
                FROM sell s 
                JOIN product p ON s.product_id = p.product_id 
                JOIN user u ON s.user_id = u.user_id
                WHERE s.user_id = ? `,

  getBuyList: `SELECT p.name, p.cost_price, p.sale_price, p.state, p.ex_date, p.barcode, p.like_count, p.sale, u.name as seller_name 
               FROM sell s 
               JOIN product p ON s.product_id = p.product_id 
               JOIN user u ON s.user_id = u.user_id
               WHERE s.user_id = ? AND p.state = '판매완료' `,
  deleteSell: 'DELETE FROM sell WHERE sell_id = ?',
};

const sellDAO = {
  createSellList: async (item, callback) => {
    const { product_id, user_id } = item;
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [resp] = await conn.query(sql.createSellList, [product_id, user_id]);

      callback({ status: 200, message: 'OK', data: resp });
    } catch (error) {
      callback({ status: 500, message: '거래 생성 실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },

  getSellList: async (user_id, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [resp] = await conn.query(sql.getSellList, [user_id]);

      callback({ status: 200, message: 'OK', data: resp });
    } catch (error) {
      callback({ status: 500, message: '판매 목록 조회 실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },

  getBuyList: async (user_id, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [resp] = await conn.query(sql.getBuyList, [user_id]);

      callback({ status: 200, message: 'OK', data: resp });
    } catch (error) {
      callback({ status: 500, message: '구매 목록 조회 실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },

  deleteSell: async (sell_id, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [resp] = await conn.query(sql.deleteSell, [sell_id]);

      callback({ status: 200, message: 'OK', data: resp });
    } catch (error) {
      callback({ status: 500, message: '판매 삭제 실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },

};

module.exports = sellDAO;