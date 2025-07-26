const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'bank_lending.db');
const db = new sqlite3.Database(dbPath);

console.log('Testing database...');

// Check if customers exist
db.all('SELECT * FROM customers', (err, customers) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Customers in database:', customers);
  }
  
  // Test customer overview endpoint
  const axios = require('axios');
  axios.get('http://localhost:3001/api/v1/customers/CUST001/overview')
    .then(response => {
      console.log('Customer overview response:', response.data);
    })
    .catch(error => {
      console.log('Customer overview error:', error.response?.data || error.message);
    })
    .finally(() => {
      db.close();
    });
}); 