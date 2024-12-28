const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./backend/routes/userRoutes');
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
const PORT = 3000;

// Prepare Next.js
app.prepare().then(() => {
  // Your existing Express routes
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.get("/", (req, res) => {
    res.send("...");
  });

  server.get("/api", (req, res) => {
    res.send("Hello from Express API");
  });

  // Handle all Next.js routes
  server.all("*", (req, res) => {
    return handle(req, res);
  });

});

// Start the server
server.listen(3000, (err) => {
  if (err) throw err;
  console.log("> Ready on http://localhost:3000");
});


