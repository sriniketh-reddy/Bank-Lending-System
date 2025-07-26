const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'bank_lending.db');
const db = new sqlite3.Database(dbPath);

const loanId = '9144cdce-77d5-45de-b494-205161cadb8d';

console.log('Checking ledger data for loan:', loanId);

db.get(`
  SELECT l.*, c.name as customer_name
  FROM loans l
  JOIN customers c ON l.customer_id = c.customer_id
  WHERE l.loan_id = ?
`, [loanId], (err, loan) => {
  if (err) {
    console.error('Database error:', err);
    return;
  }

  if (!loan) {
    console.log('Loan not found');
    return;
  }

  console.log('Loan data:', loan);

  db.all(`
    SELECT payment_id as transaction_id, payment_date as date, amount, payment_type as type
    FROM payments
    WHERE loan_id = ?
    ORDER BY payment_date
  `, [loanId], (err, transactions) => {
    if (err) {
      console.error('Database error:', err);
      return;
    }

    console.log('Transactions:', transactions);

    const amountPaid = transactions.reduce((sum, t) => sum + t.amount, 0);
    const balanceAmount = loan.total_amount - amountPaid;
    
    // Calculate adjusted EMI similar to customer overview
    const totalMonths = loan.loan_period_years * 12;
    const emisPaid = transactions.filter(t => t.type === 'EMI').length;
    const monthsLeft = totalMonths - emisPaid;
    let adjustedEmi = loan.monthly_emi;
    
    if (monthsLeft > 0 && balanceAmount > 0) {
      adjustedEmi = balanceAmount / monthsLeft;
    }
    
    let emisLeft = Math.max(0, monthsLeft);
    if (balanceAmount <= 0) {
      emisLeft = 0;
    }

    console.log('\nLedger calculations:');
    console.log('Amount paid:', amountPaid);
    console.log('Balance amount:', balanceAmount);
    console.log('Total months:', totalMonths);
    console.log('EMIs paid:', emisPaid);
    console.log('Months left:', monthsLeft);
    console.log('Adjusted EMI:', adjustedEmi);
    console.log('EMIs left:', emisLeft);

    db.close();
  });
}); 