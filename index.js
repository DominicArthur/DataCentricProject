const express = require('express');
const path = require('path');
const mysql = require('mysql');
const ejs = require('ejs');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const { Manager } = require('./mongodb');

const app = express();
const port = 3000;

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

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

  // Checks to see if ID is 4 chars
  if (mgrid.length !== 4) {
    return res.status(400).send('Manager ID must be 4 characters');
  }

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

// Define the route for deleting a product
app.get('/products/delete/:pid', (req, res) => {
    const pid = req.params.pid;
  
    // Check if the product is sold in any store
    pool.query('SELECT COUNT(*) AS storeCount FROM store_product WHERE pid = ?', [pid], (error, result) => {
      if (error) {
        console.error('Error checking product associations in the database:', error);
        return res.status(500).send('Error checking product associations in the database');
      }
  
      const storeCount = result[0].storeCount;
  
      if (storeCount === 0) {
        // If the product is not sold in any store, delete it
        pool.query('DELETE FROM product WHERE pid = ?', [pid], (deleteError) => {
          if (deleteError) {
            console.error('Error deleting product from the database:', deleteError);// Error wont show up on the page
            return res.status(500).send('Error Deleting Product');// 
          }
          res.redirect('/products');
        });
      } else {
        // If the product is sold in one or more stores, show an error message
        return res.status(400).send('Cannot delete product. It is sold in one or more stores.');
      }
    });
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
  

  // Route to fetch and display Managers
app.get('/managers', async (req, res) => {
  try {
    const managers = await Manager.find({});
    res.render('managers', { managers });
  } catch (error) {
    console.error('Error fetching managers from MongoDB:', error);
    res.status(500).send('Error fetching managers');
  }
});

// Define the route for adding a store (GET request to show the form)
app.get('/stores/add', (req, res) => {
  res.render('addStore');
});

// Define the route for adding a store (POST request for form submission)
app.post('/stores/add', (req, res) => {
  const { storeId, location, mgrid } = req.body;

// Makes sure manager id is 4 chars
  if (mgrid.length !== 4) {
    return res.status(400).send('Manager ID must be 4 characters');
}

  const insertQuery = 'INSERT INTO store (sid, location, mgrid) VALUES (?, ?, ?)';
  pool.query(insertQuery, [storeId, location, mgrid], (error) => {
      if (error) {
          return res.status(500).send('Error adding store to the database');
      }
      res.redirect('/stores');
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});





