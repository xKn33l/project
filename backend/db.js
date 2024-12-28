const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite 
const db = new sqlite3.Database('./touristsync.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create a "users" table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Users table created (if it didn\'t exist).');
    }
  });
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskname TEXT NOT NULL,
    task_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );`
  );
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    expense_id INTEGER PRIMARY KEY AUTOINCREMENT,
    expense_name TEXT NOT NULL,
    expense_desc TEXT NOT NULL
    );`
  );
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS preferences (
    location TEXT NOT NULL
    );`
  );
});


// Closing the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
