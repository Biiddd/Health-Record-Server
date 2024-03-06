const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '192.168.124.34',
    user: 'G15',
    password: 'Kjt160789!',
    database: 'Health-Record'
});

module.exports = db;