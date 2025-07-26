const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'database', 'bank_lending.db');
const db = new sqlite3.Database(dbPath);

router.get('/customers/:customerId/overview', (req, res) => {
  const { customerId } = req.params;

  // First check if customer exists
  const customerCheckQuery = 'SELECT customer_id, name FROM customers WHERE customer_id = ?';
  
  db.get(customerCheckQuery, [customerId], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Now get loans for this customer with adjusted EMI calculation
    const loansQuery = `
      SELECT 
        l.loan_id,
        l.principal_amount as principal,
        l.total_amount,
        (l.total_amount - l.principal_amount) as total_interest,
        l.monthly_emi as original_emi,
        l.loan_period_years,
        COALESCE(SUM(p.amount), 0) as amount_paid,
        COUNT(CASE WHEN p.payment_type = 'EMI' THEN 1 END) as emis_paid
      FROM loans l
      LEFT JOIN payments p ON l.loan_id = p.loan_id
      WHERE l.customer_id = ?
      GROUP BY l.loan_id
    `;

    db.all(loansQuery, [customerId], (err, loans) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const totalLoans = loans.length;

      // Calculate adjusted EMI for each loan
      const loansWithAdjustedEmi = loans.map(loan => {
        const totalMonths = loan.loan_period_years * 12;
        const monthsLeft = totalMonths - loan.emis_paid;
        const remainingBalance = loan.total_amount - loan.amount_paid;
        
        // Calculate adjusted EMI based on remaining balance and months left
        let adjustedEmi = loan.original_emi;
        if (monthsLeft > 0 && remainingBalance > 0) {
          adjustedEmi = remainingBalance / monthsLeft;
        }
        
        // Calculate EMIs left based on remaining balance and adjusted EMI
        let emisLeft = 0;
        if (remainingBalance > 0 && adjustedEmi > 0) {
          emisLeft = Math.ceil(remainingBalance / adjustedEmi);
        }
        // If loan is fully paid, EMIs left should be 0
        if (remainingBalance <= 0) {
          emisLeft = 0;
        }

        return {
          loan_id: loan.loan_id,
          principal: loan.principal,
          total_amount: loan.total_amount,
          total_interest: loan.total_interest,
          emi_amount: adjustedEmi,
          amount_paid: loan.amount_paid,
          emis_left: emisLeft
        };
      });

      res.json({
        customer_id: customerId,
        customer_name: customer.name,
        total_loans: totalLoans,
        loans: loansWithAdjustedEmi
      });
    });
  });
});

module.exports = router; 