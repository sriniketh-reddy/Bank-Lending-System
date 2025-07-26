const express = require('express');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'database', 'bank_lending.db');
const db = new sqlite3.Database(dbPath);

const calculateLoanDetails = (principal, years, interestRate) => {
  const totalInterest = principal * years * (interestRate / 100);
  const totalAmount = principal + totalInterest;
  const monthlyEmi = totalAmount / (years * 12);
  return { totalInterest, totalAmount, monthlyEmi };
};

router.post('/loans', (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

  // Convert all values to numbers
  const principal = Number(loan_amount);
  const years = Number(loan_period_years);
  const interestRate = Number(interest_rate_yearly);

  if (!customer_id || isNaN(principal) || isNaN(years) || isNaN(interestRate)) {
    return res.status(400).json({ error: 'All fields are required and must be valid numbers' });
  }

  if (principal <= 0 || years <= 0 || interestRate <= 0) {
    return res.status(400).json({ error: 'All values must be positive' });
  }

  const loanId = uuidv4();
  const { totalAmount, monthlyEmi } = calculateLoanDetails(principal, years, interestRate);

  const query = `
    INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [loanId, customer_id, principal, totalAmount, interestRate, years, monthlyEmi], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create loan' });
    }

    res.status(201).json({
      loan_id: loanId,
      customer_id,
      total_amount_payable: totalAmount,
      monthly_emi: monthlyEmi
    });
  });
});

router.post('/loans/:loanId/payments', (req, res) => {
  const { loanId } = req.params;
  const { amount, payment_type } = req.body;

  if (!amount || !payment_type) {
    return res.status(400).json({ error: 'Amount and payment type are required' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be positive' });
  }

  if (!['EMI', 'LUMP_SUM'].includes(payment_type)) {
    return res.status(400).json({ error: 'Payment type must be EMI or LUMP_SUM' });
  }

  const paymentId = uuidv4();

  db.get('SELECT * FROM loans WHERE loan_id = ?', [loanId], (err, loan) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Get total paid so far
    db.get('SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE loan_id = ?', [loanId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      const totalPaid = Number(row.total_paid);
      const totalAmount = Number(loan.total_amount);
      const newTotal = totalPaid + Number(amount);
      
      // Validate EMI payment amount
      if (payment_type === 'EMI') {
        // Calculate adjusted EMI for validation
        const totalMonths = loan.loan_period_years * 12;
        db.get('SELECT COUNT(*) as emi_count FROM payments WHERE loan_id = ? AND payment_type = "EMI"', [loanId], (err, row) => {
          const emisPaid = row ? row.emi_count : 0;
          const monthsLeft = totalMonths - emisPaid;
          const remainingBalance = totalAmount - totalPaid;
          
          let adjustedEmi = loan.monthly_emi;
          if (monthsLeft > 0 && remainingBalance > 0) {
            adjustedEmi = remainingBalance / monthsLeft;
          }
          
          const tolerance = 0.01; // Allow 1 paisa tolerance for rounding
          if (Math.abs(amount - adjustedEmi) > tolerance) {
            return res.status(400).json({ 
              error: `EMI payment must be exactly ₹${adjustedEmi.toFixed(2)}. You entered ₹${amount.toFixed(2)}.` 
            });
          }
          
          // Continue with payment processing
          processPayment();
        });
      } else {
        // For lump sum payments, continue directly
        processPayment();
      }
      
      function processPayment() {
        if (newTotal > totalAmount) {
          return res.status(400).json({ error: 'Payment exceeds remaining balance. You cannot pay more than the total payable amount.' });
        }
        
        db.run('INSERT INTO payments (payment_id, loan_id, amount, payment_type) VALUES (?, ?, ?, ?)',
          [paymentId, loanId, amount, payment_type], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to record payment' });
          }

          let remainingBalance = totalAmount - newTotal;
          let emisLeft = Math.ceil(remainingBalance / loan.monthly_emi);
          if (remainingBalance <= 0) {
            remainingBalance = 0;
            emisLeft = 0;
          }

          let newEmi = loan.monthly_emi;
          // If payment is LUMP_SUM and there is still a balance, recalculate EMI
          if (payment_type === 'LUMP_SUM' && emisLeft > 0) {
            // Calculate months left in original loan
            const totalMonths = loan.loan_period_years * 12;
            // Count number of EMI payments made
            db.get('SELECT COUNT(*) as emi_count FROM payments WHERE loan_id = ? AND payment_type = "EMI"', [loanId], (err, row) => {
              const emisPaid = row ? row.emi_count : 0;
              const monthsLeft = totalMonths - emisPaid;
              if (monthsLeft > 0) {
                newEmi = remainingBalance / monthsLeft;
              }
              res.json({
                payment_id: paymentId,
                loan_id: loanId,
                message: 'Payment recorded successfully.',
                remaining_balance: remainingBalance,
                emis_left: emisLeft,
                new_emi: Number(newEmi)
              });
            });
          } else {
            res.json({
              payment_id: paymentId,
              loan_id: loanId,
              message: 'Payment recorded successfully.',
              remaining_balance: remainingBalance,
              emis_left: emisLeft,
              new_emi: Number(newEmi)
            });
          }
        });
      }
    });
  });
});

router.get('/loans/:loanId/ledger', (req, res) => {
  const { loanId } = req.params;

  const loanQuery = `
    SELECT l.*, c.name as customer_name
    FROM loans l
    JOIN customers c ON l.customer_id = c.customer_id
    WHERE l.loan_id = ?
  `;

  const paymentsQuery = `
    SELECT payment_id as transaction_id, payment_date as date, amount, payment_type as type
    FROM payments
    WHERE loan_id = ?
    ORDER BY payment_date
  `;

  db.get(loanQuery, [loanId], (err, loan) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    db.all(paymentsQuery, [loanId], (err, transactions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

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

      res.json({
        loan_id: loan.loan_id,
        customer_id: loan.customer_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        monthly_emi: adjustedEmi,
        amount_paid: amountPaid,
        balance_amount: balanceAmount,
        current_balance: balanceAmount,
        emis_left: emisLeft,
        transactions
      });
    });
  });
});

module.exports = router; 