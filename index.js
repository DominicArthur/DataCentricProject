
const express = require('express');
const app = express();
// The port number for the server to listen on
const port = 3000; 

// Define the route for the Home Page
app.get('/', (req, res) => {
  // HTML response with links to other pages
  res.send(`
    <h1>Welcome to the Home Page</h1>
    <ul>
      <li><a href="/stores">Stores Page</a></li>
      <li><a href="/products">Products Page</a></li>
      <li><a href="/managers">Managers (MongoDB) Page</a></li>
    </ul>
  `);
});

// Define the route for the Stores Page
app.get('/stores', (req, res) => {
  
  res.send('<h1>Stores Page</h1>');
});

// Define the route for the Products Page
app.get('/products', (req, res) => {
  
  res.send('<h1>Products Page</h1>');
});

// Define the route for the Managers (MongoDB) Page
app.get('/managers', (req, res) => {
  
  res.send('<h1>Managers (MongoDB) Page</h1>');
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

