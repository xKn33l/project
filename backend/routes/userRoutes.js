const express = require('express');
const userModel = require('../models/userModel');

const router = express.Router();

console.log('Initializing user routes...');
  
// Let's register a user 
router.get('/register', (req, res) => {
    const { name, email, password } = req.body; 

    if (!name || !email || !password ) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    userModel.registerUser(name, email, password, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to register user.'});
        }
        res.status(201).json({ message: 'User registered successfully!', user });
    });
});

// Login now 
router.get('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.'});
    }
    
    userModel.authenticateUser(email, password, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to auth user.'});
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.'});
        }

        res.json({ message: 'Login successful!', user });
    });
});

router.get('/tasks', (req, res) => {
    const { task, due_date } = req.body;
    if (!task || !due_date ) {
        return res.status(400).json({ error: 'Task and Date required.'});
    }
});

module.exports = router; 
