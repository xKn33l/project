const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // Import the database connection from db.js
const router = express.Router();


// Dummy data for the dashboard route
app.get('/dashboard', (req, res) => {
 
  const mockUserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    tasks: [
      { id: 1, taskname: 'Book flight tickets', date: '2024-12-30' },
      { id: 2, taskname: 'Pack luggage', date: '2024-12-31' },
      { id: 3, taskname: 'Check-in to hotel', date: '2024-12-31' },
    ],
    expenses: [
      { id: 1, name: 'Flight Tickets', description: 'Round trip tickets', amount: 450 },
      { id: 2, name: 'Hotel Booking', description: '3 nights stay', amount: 300 },
    ],
  };

  res.status(200).json(mockUserData);
});
