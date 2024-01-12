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
  checkWishlist: 'SELECT * FROM wishlist WHERE wish_id = ?',
  getWishlist: `SELECT p.name, p.sale_price
                FROM user u
                JOIN wishlist w ON u.user_id = w.user_id
                JOIN product p ON w.product_id = p.product_id
                WHERE u.user_id = ?`,
  addWishlist: 'INSERT INTO wishlist(product_id, user_id) VALUES (?, ?)',
  deleteWishlist: 'DELETE FROM wishlist WHERE wish_id = ?',
};

const wishlistDAO = {
  checkWishlist: async (wish_id, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [wishlistItem] = await conn.query(sql.checkWishlist, [wish_id]);

      callback({ status: 200, message: 'OK', data: wishlistItem[0] });
    } catch (error) {
      callback({ status: 500, message: '실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },

  getWishlist: async (userId, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [getWishlist] = await conn.query(sql.getWishlist, [userId]);

      callback({ status: 200, message: 'OK', data: getWishlist });
    } catch (error) {
      callback({ status: 500, message: '리스트 불러오기 실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },


  addWishlist: async (item, callback) => {
    const{product_id, user_id} = item
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [resp] = await conn.query(sql.addWishlist, [product_id, user_id]);

      callback({ status: 200, message: 'OK', data: resp });
    } catch (error) {
      callback({ status: 500, message: '위시리스트 추가 실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },

  deleteWishlist: async (wish_id, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [resp] = await conn.query(sql.deleteWishlist, [wish_id]);
      
      callback({ status: 200, message: 'OK', data: resp });
    } catch (error) {
      callback({ status: 500, message: '위시리스트 삭제 실패', error: error });
    } finally {
      if (conn !== null) conn.release();
    }
  },
};

module.exports = wishlistDAO;