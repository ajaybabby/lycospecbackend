const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,      // cute-birds-begin.loca.lt (from .env)
  user: process.env.DB_USER,      // your MySQL username
  password: process.env.DB_PASSWORD,  // your MySQL password
  database: process.env.DB_NAME,      // your database name
  port: process.env.DB_PORT,      // 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
module.exports = pool.promise();

