// createUser.js

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Connect to SQLite database
const db = new sqlite3.Database('../touristsync.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});



// Function to create a user
const createUser = async () => {
  const saltRounds = 10;
  const password = 'your-password'; // Replace with your desired password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const name = 'John Doe'; // Replace with the user's name
  const email = 'user@example.com'; // Replace with the email

  db.run(
    'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    (err) => {
      if (err) {
        console.error('Error inserting user:', err.message);
      } else {
        console.log('User added successfully.');
      }
      db.close(); // Close the database connection after the insertion
    }
  );
};

createUser();
