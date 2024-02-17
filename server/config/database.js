// const mongoose = require('mongoose');
// const { connection } = require('mongoose');
const mysql = require('mysql2/promise');

async function connect() {
    try {
        const pool = await mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 500,
            queueLimit: 0,
        });
        return pool;
       
    } catch (error) {
        console.error('Could not connect to the database:', error);
        process.exit(1);
    }   
}

module.exports = { connect };






