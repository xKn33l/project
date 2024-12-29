const express = require('express');
const loginRoute = require('./routes/login'); // Import the login route
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Body parser middleware
app.use(express.json());

// Example API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working!' });
});

app.get('/', (req,res) => {
  res.json({ message: 'Hello!'});
});

// Use the login route
app.use('/login', loginRoute);


app.get('/dashboard', (req, res) => {
  res.json({ message: 'Login Successful' });
});


// Start the Express server
app.listen(PORT, () => {
  console.log(`Express backend running on http://localhost:${PORT}`);
});
