const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing Ledger API...');
    const ledgerResponse = await axios.get('http://localhost:3001/api/v1/loans/9144cdce-77d5-45de-b494-205161cadb8d/ledger');
    console.log('Ledger API Response:');
    console.log(JSON.stringify(ledgerResponse.data, null, 2));
    
    console.log('\nTesting Customer Overview API...');
    const overviewResponse = await axios.get('http://localhost:3001/api/v1/customers/CUST001/overview');
    console.log('Customer Overview API Response:');
    console.log(JSON.stringify(overviewResponse.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAPI(); 