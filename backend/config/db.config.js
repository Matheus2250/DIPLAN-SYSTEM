const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Criar pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Converter pool para usar Promises para async/await
const promisePool = pool.promise();

module.exports = promisePool;