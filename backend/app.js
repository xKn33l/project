const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Create tables
  db.run("CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)");
  db.run("CREATE TABLE expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, amount REAL)");
});

// Weather API route
app.post('/api/weather', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const apiKey = process.env.WEATHER_API;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error fetching weather data' });
    }

    const data = await response.json();
    const weatherData = {
      name: data.name,
      temperature: data.main.temp,
      lat: data.coord.lat,
      lon: data.coord.lon,
    };
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// To-Do List API routes
app.get('/api/todos', (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/todos', (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  db.run("INSERT INTO todos (task) VALUES (?)", [task], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, task });
  });
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'To-Do deleted' });
  });
});

// Expenses API routes
app.get('/api/expenses', (req, res) => {
  db.all("SELECT * FROM expenses", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/expenses', (req, res) => {
  const { title, amount } = req.body;

  if (!title || !amount) {
    return res.status(400).json({ error: 'Title and amount are required' });
  }

  db.run("INSERT INTO expenses (title, amount) VALUES (?, ?)", [title, amount], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, title, amount });
  });
});

app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM expenses WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Expense deleted' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
