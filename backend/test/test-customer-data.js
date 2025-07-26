const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'bank_lending.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking customer overview data for CUST001...');

db.get(`
  SELECT 
    l.loan_id,
    l.principal_amount,
    l.total_amount,
    l.loan_period_years,
    l.monthly_emi,
    COALESCE(SUM(p.amount), 0) as amount_paid,
    COUNT(CASE WHEN p.payment_type = 'EMI' THEN 1 END) as emis_paid
  FROM loans l
  LEFT JOIN payments p ON l.loan_id = p.loan_id
  WHERE l.customer_id = 'CUST001'
  GROUP BY l.loan_id
`, [], (err, row) => {
  if (err) {
    console.error('Database error:', err);
  } else {
    console.log('Loan data:', row);
    if (row) {
      const totalMonths = row.loan_period_years * 12;
      const monthsLeft = totalMonths - row.emis_paid;
      const remainingBalance = row.total_amount - row.amount_paid;
      
      console.log('\nCalculations:');
      console.log('Total months:', totalMonths);
      console.log('EMIs paid:', row.emis_paid);
      console.log('Months left:', monthsLeft);
      console.log('Amount paid:', row.amount_paid);
      console.log('Remaining balance:', remainingBalance);
      console.log('Adjusted EMI:', remainingBalance / monthsLeft);
      console.log('EMIs left (old):', monthsLeft);
      console.log('EMIs left (new):', Math.ceil(remainingBalance / (remainingBalance / monthsLeft)));
    }
  }
  
  console.log('\nAll payments for this loan:');
  db.all('SELECT * FROM payments WHERE loan_id = ? ORDER BY payment_date', [row?.loan_id], (err, payments) => {
    if (err) {
      console.error('Error getting payments:', err);
    } else {
      console.log('Payments:', payments);
    }
    db.close();
  });
}); 