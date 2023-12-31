const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const ejs = require('ejs');
const bodyParser = require('body-parser'); // Add this line

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
    res.render('stores', { stores: results });
  });
});

// Define the route for updating a store (GET request)
app.get('/stores/update/:sid', (req, res) => {
  const sid = req.params.sid;

  console.log('Store ID:', sid);
  
  // Fetch the details of the store to be updated
  pool.query('SELECT * FROM store WHERE sid = ?', [sid], (error, result) => {
    if (error) {
      return res.status(500).send('Error fetching store details from the database');
    }

    res.render('edit.ejs', { store: result[0] });
  });
});

// Define the route for updating a store (POST request)
app.post('/stores/update/:sid', (req, res) => {
  const sid = req.params.sid;
  const { location, mgrid } = req.body;

  // Update the store in the database
  pool.query(
    'UPDATE store SET location = ?, mgrid = ? WHERE sid = ?',
    [location, mgrid, sid],
    (error) => {
      if (error) {
        return res.status(500).send('Error updating store in the database');
      }
      res.redirect('/stores');
    }
  );
});

// Define the route for the Products Page
app.get('/products', (req, res) => {
    // Fetch details of all products from the database
    const query = `
      SELECT p.pid, p.productdesc as description, s.sid, s.location, ps.price
      FROM product p
      JOIN product_store ps ON p.pid = ps.pid
      JOIN store s ON ps.sid = s.sid;
    `;
  
    pool.query(query, (error, results) => {
      if (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).send('Error fetching products from the database');
      }
      console.log('Products fetched successfully:', results);
      res.render('products', { products: results });
    });
  });
  

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});





