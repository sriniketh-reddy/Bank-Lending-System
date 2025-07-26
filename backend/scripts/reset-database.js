const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'database');
const dbPath = path.join(dbDir, 'bank_lending.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('DELETE FROM payments');
  db.run('DELETE FROM loans');
  db.run('DELETE FROM customers', (err) => {
    if (err) {
      console.error('Error resetting database:', err);
    } else {
      console.log('All records deleted from payments, loans, and customers tables.');
    }
    db.close();
  });
}); 