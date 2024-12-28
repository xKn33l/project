const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./backend/routes/userRoutes');


const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json()); // Built-in middleware to parse JSON in Express


// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Tourist System API!');
}); 

console.log('Loading user routes...');
app.use('/users', userRoutes);
console.log('User routes loaded.');

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
}); 




// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
