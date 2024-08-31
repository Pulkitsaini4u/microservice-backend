const mysql = require('mysql2');

function initializeDatabase() {
    try {
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            port: '3306',
            user: 'root',
            password: 'P@ssw0rd'
        });
        connection.query(`CREATE DATABASE IF NOT EXISTS customer`);
        console.log('running')
    } catch (err) {
        console.log(err)
    }
}
module.exports = {
    initializeDatabase
}