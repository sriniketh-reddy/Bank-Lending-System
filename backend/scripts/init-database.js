const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'database');
const dbPath = path.join(dbDir, 'bank_lending.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Delete all records from all tables
      db.run('DELETE FROM payments');
      db.run('DELETE FROM loans');
      db.run('DELETE FROM customers');

      db.run(`CREATE TABLE IF NOT EXISTS customers (
        customer_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS loans (
        loan_id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        principal_amount DECIMAL(15,2) NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        loan_period_years INTEGER NOT NULL,
        monthly_emi DECIMAL(15,2) NOT NULL,
        status TEXT DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS payments (
        payment_id TEXT PRIMARY KEY,
        loan_id TEXT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        payment_type TEXT NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
      )`);

      db.run(`INSERT OR IGNORE INTO customers (customer_id, name) VALUES 
        ('CUST001', 'Amit Sharma'),
        ('CUST002', 'Priya Singh'),
        ('CUST003', 'Rahul Verma')`, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });

    });
  });
};

createTables()
  .then(() => {
    console.log('Database initialized successfully!');
    db.close();
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
    db.close();
  }); 