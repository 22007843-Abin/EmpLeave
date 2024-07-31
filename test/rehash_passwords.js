//chatgpt
const bcrypt = require('bcryptjs');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'EmployeeLeaveDB'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

const users = [
    { email: 'manager1@example.com', password: 'password' },
    { email: 'employee1@example.com', password: 'password' },
    { email: 'employee2@example.com', password: 'password' }
];

users.forEach(user => {
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) throw err;
        const sql = "UPDATE Users SET password = ? WHERE email = ?";
        db.query(sql, [hash, user.email], (err, result) => {
            if (err) throw err;
            console.log(`Password for ${user.email} updated`);
        });
    });
});
