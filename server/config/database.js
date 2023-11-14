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
            connectionLimit: 200,
            queueLimit: 0,
        });
        // console.log('Succes connect to the database:');
        return pool;
       
    } catch (error) {
        console.error('Could not connect to the database:', error);
        process.exit(1);
    }   
}

module.exports = { connect };




// const connect = () => {
//   mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   const db = mongoose.connection;

//   db.on('error', err => {
//     console.error('Could not connect to database:', err);
//     process.exit(1);
//   });

//   db.once('open', () => {
//     console.log('Database successfully connected');
//   });
// };



