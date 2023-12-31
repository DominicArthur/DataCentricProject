const express = require('express');
const app = express();
const path = require('path');
const port = 3000;// The port number for the server to listen on
app.use(express.static('public'));


app.get('/', (req, res) => {
  // Send the 'index.html' file when a user accesses the root URL
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server starts
  console.log(`Server listening at http://localhost:${port}`);
});



