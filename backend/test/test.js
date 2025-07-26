const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

const testAPI = async () => {
  console.log('🧪 Testing Bank Lending System API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check passed:', healthResponse.data);

    // Test 2: Create Loan
    console.log('\n2. Testing loan creation...');
    const loanData = {
      customer_id: 'CUST001',
      loan_amount: 10000,
      loan_period_years: 2,
      interest_rate_yearly: 10
    };
    const createLoanResponse = await axios.post(`${BASE_URL}/loans`, loanData);
    console.log('✅ Loan created:', createLoanResponse.data);
    const loanId = createLoanResponse.data.loan_id;

    // Test 3: Make Payment
    console.log('\n3. Testing payment recording...');
    const paymentData = {
      amount: 1000,
      payment_type: 'EMI'
    };
    const paymentResponse = await axios.post(`${BASE_URL}/loans/${loanId}/payments`, paymentData);
    console.log('✅ Payment recorded:', paymentResponse.data);

    // Test 4: View Ledger
    console.log('\n4. Testing ledger view...');
    const ledgerResponse = await axios.get(`${BASE_URL}/loans/${loanId}/ledger`);
    console.log('✅ Ledger retrieved:', {
      loan_id: ledgerResponse.data.loan_id,
      customer_id: ledgerResponse.data.customer_id,
      principal: ledgerResponse.data.principal,
      total_amount: ledgerResponse.data.total_amount,
      amount_paid: ledgerResponse.data.amount_paid,
      balance_amount: ledgerResponse.data.balance_amount,
      emis_left: ledgerResponse.data.emis_left,
      transactions_count: ledgerResponse.data.transactions.length
    });

    // Test 5: Customer Overview
    console.log('\n5. Testing customer overview...');
    const overviewResponse = await axios.get(`${BASE_URL}/customers/CUST001/overview`);
    console.log('✅ Customer overview retrieved:', {
      customer_id: overviewResponse.data.customer_id,
      total_loans: overviewResponse.data.total_loans,
      loans_count: overviewResponse.data.loans.length
    });

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('- Health check: ✅');
    console.log('- Loan creation: ✅');
    console.log('- Payment recording: ✅');
    console.log('- Ledger view: ✅');
    console.log('- Customer overview: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 