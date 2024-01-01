/*const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/companyDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const managerSchema = new mongoose.Schema({
  _id: String,  
  name: String,
  salary: Number
});

const Manager = mongoose.model('Manager', managerSchema);

module.exports = {
  Manager
};
*/
