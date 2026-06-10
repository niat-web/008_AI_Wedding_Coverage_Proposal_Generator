const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2/promise');

let pool = null;
let useMySQL = false;

const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'thereelshoot_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function initializeDatabase() {
  try {
    console.log('Trying MySQL with user:', mysqlConfig.user);
    console.log('Password loaded:', mysqlConfig.password ? 'YES' : 'NO');

    pool = mysql.createPool(mysqlConfig);

    const connection = await pool.getConnection();
    console.log('MySQL Database connected successfully.');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS proposals (
        id VARCHAR(50) PRIMARY KEY,
        couple_names VARCHAR(255) NOT NULL,
        wedding_date VARCHAR(50) NOT NULL,
        venue VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        events TEXT NOT NULL,
        package_type VARCHAR(50) NOT NULL,
        special_requests TEXT,
        theme VARCHAR(20) NOT NULL DEFAULT 'dark',
        proposal TEXT NOT NULL,
        created_at VARCHAR(100) NOT NULL
      )
    `);

    console.log('MySQL proposals table structure verified.');

    connection.release();
    useMySQL = true;
  } catch (error) {
    console.error('Error connecting to MySQL database. Falling back to local file DB:', error.message);
    useMySQL = false;
  }
}

function getPool() {
  return pool;
}

function isMySQLEnabled() {
  return useMySQL;
}

module.exports = {
  initializeDatabase,
  getPool,
  isMySQLEnabled
};