const mysql = require('mysql2');
const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('Server is running at port 3000');
})

app.get("/", (req, res) => {
    res.send("Hello World!!!");
})

const connection = mysql.createConnection({
    host: '192.168.124.34',
    user: 'G15',
    password: 'Kjt160789!',
    database: 'Health-Record'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


const sql = `SELECT * FROM user`;

connection.query(sql, (error, results, fields) => {
    if (error) {
        console.error('Error executing SQL:', error);
        return;
    }
    console.log('Query results:', results);
});

connection.end();