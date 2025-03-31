// config/dbConnection.js
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function dbconnect() {
  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error connecting to MySQL:", error.message);
      return;
    }
    console.log("MySQL Database Connected!");
    connection.release();
  });
}

module.exports = { dbconnect, pool }; // Export pool here
