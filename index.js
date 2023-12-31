const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const ejs = require('ejs');
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// SQL database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'proj2023',
};

// Creating the SQL connection pool
const pool = mysql.createPool(dbConfig);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define the route for the Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define the route for the Stores Page
app.get('/stores', (req, res) => {
  // Fetch details of all stores from the database
  pool.query('SELECT * FROM store', (error, results) => {
    if (error) {
      return res.status(500).send('Error fetching stores from the database');
    }
    res.render('stores', { stores: results });// Render the 'stores.ejs' view with the fetched store details
});
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




