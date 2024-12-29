const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // Import the database connection from db.js
const router = express.Router();

// POST request to validate user login
router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Query to get user data from the database
  db.get('SELECT * FROM Users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error querying database.' });
    }

    if (!row) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Compare the hashed password
    const isValidPassword = await bcrypt.compare(password, row.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // If credentials are valid, return a success response
    return res.status(200).json({ message: 'Login successful!' });
  });
});

module.exports = router;
