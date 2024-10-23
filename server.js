   const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL passwordy
    database: 'todo_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Routes for CRUD Operations
// Create Todo
app.post('/todos', (req, res) => {
    const { task } = req.body;
    const sql = 'INSERT INTO todos (task) VALUES (?)';
    db.query(sql, [task], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Todo created', id: result.insertId });
    });
});

// Read Todos
app.get('/todos', (req, res) => {
    const sql = 'SELECT * FROM todos';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Update Todo
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    const sql = 'UPDATE todos SET task = ? WHERE id = ?';
    db.query(sql, [task, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Todo updated' });
    });
});

// Delete Todo
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM todos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Todo deleted' });
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
