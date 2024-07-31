const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authenticateToken = require('./middleware/auth');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/', (req, res) => {
    res.render('index');
});

// Ensure message is defined for the login view
app.get('/login', (req, res) => {
    res.render('login', { message: null });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM Users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    const token = jwt.sign({ userID: user.userID, role: user.role }, 'your_secret_key');
                    res.cookie('token', token, { httpOnly: true });
                    if (user.role === 'manager') {
                        res.redirect('/manager/dashboard');
                    } else {
                        res.redirect('/home');
                    }
                } else {
                    res.render('login', { message: 'Incorrect Password' });
                }
            });
        } else {
            res.render('login', { message: 'User not found' });
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register', { message: null });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, 'employee')";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) throw err;
        res.render('login', { message: 'Registration successful. Please login.' });
    });
});

app.get('/register_manager', (req, res) => {
    res.render('register_manager', { message: null });
});

app.post('/register_manager', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, 'manager')";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) throw err;
        res.render('login', { message: 'Manager registration successful. Please login.' });
    });
});

app.get('/home', authenticateToken, (req, res) => {
    res.render('home', { message: null });
});

app.get('/apply_leave', authenticateToken, (req, res) => {
    res.render('apply_leave', { message: null });
});

app.post('/apply_leave', authenticateToken, (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;
    const userID = req.user.userID;

    const leaveRequest = {
        userID,
        leaveType,
        startDate,
        endDate,
        reason: leaveType === 'Other' ? reason : '',
        status: 'pending'
    };

    db.query('INSERT INTO LeaveRequests SET ?', leaveRequest, (err, result) => {
        if (err) throw err;
        res.render('apply_leave_success', { message: 'Leave application submitted successfully.' });
    });
});

app.get('/view_status', authenticateToken, (req, res) => {
    const userID = req.user.userID;
    db.query('SELECT * FROM LeaveRequests WHERE userID = ?', [userID], (err, results) => {
        if (err) throw err;
        res.render('view_status', { leaveRequests: results, message: null });
    });
});

// Route to render the edit leave form
app.get('/edit_leave', authenticateToken, (req, res) => {
    const requestID = req.query.requestID;
    db.query('SELECT * FROM LeaveRequests WHERE requestID = ?', [requestID], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.render('edit_leave', { leaveRequest: result[0], message: null });
        } else {
            res.send('Leave request not found');
        }
    });
});

// Route to handle the edit leave form submission
app.post('/edit_leave', authenticateToken, (req, res) => {
    const { requestID, leaveType, startDate, endDate, reason } = req.body;
    const leaveRequest = {
        leaveType,
        startDate,
        endDate,
        reason: leaveType === 'Other' ? reason : ''
    };

    db.query('UPDATE LeaveRequests SET ? WHERE requestID = ?', [leaveRequest, requestID], (err, result) => {
        if (err) throw err;
        res.redirect('/view_status');
    });
});

app.get('/manager/dashboard', authenticateToken, (req, res) => {
    db.query('SELECT * FROM LeaveRequests', (err, results) => {
        if (err) throw err;
        res.render('manager_dashboard', { leaveRequests: results, message: null });
    });
});

app.post('/manager/approve_leave', authenticateToken, (req, res) => {
    const { requestID } = req.body;
    db.query('UPDATE LeaveRequests SET status = "approved" WHERE requestID = ?', [requestID], (err, result) => {
        if (err) throw err;
        res.redirect('/manager/dashboard');
    });
});

app.post('/manager/reject_leave', authenticateToken, (req, res) => {
    const { requestID } = req.body;
    db.query('UPDATE LeaveRequests SET status = "rejected" WHERE requestID = ?', [requestID], (err, result) => {
        if (err) throw err;
        res.redirect('/manager/dashboard');
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
