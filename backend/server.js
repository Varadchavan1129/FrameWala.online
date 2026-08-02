// server.js
// Express API server boilerplate for FrameWala E-commerce app

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection setup (credentials from environment variables)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'framewala_db'
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + db.threadId);
});

// Simple root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the FrameWala E-Commerce API!' });
});

// Example route: Get all products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
