import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import axios from 'axios';

const CreateLoan = () => {
  const [formData, setFormData] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const customers = [
    { id: 'CUST001', name: 'Amit Sharma' },
    { id: 'CUST002', name: 'Priya Singh' },
    { id: 'CUST003', name: 'Rahul Verma' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/v1/loans', formData);
      setResult(response.data);
      setFormData({
        customer_id: '',
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AccountBalance sx={{ mr: 2, fontSize: 40 }} color="primary" />
          <Typography variant="h4" component="h1">
            Create New Loan
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create a new loan for a customer with principal amount, interest rate, and loan period.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Loan Details
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                select
                fullWidth
                label="Customer"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                margin="normal"
                required
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.id})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Loan Amount"
                name="loan_amount"
                type="number"
                value={formData.loan_amount}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ min: 0, step: 0.01 }}
              />

              <TextField
                fullWidth
                label="Loan Period (Years)"
                name="loan_period_years"
                type="number"
                value={formData.loan_period_years}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ min: 1, max: 30 }}
              />

              <TextField
                fullWidth
                label="Interest Rate (% per year)"
                name="interest_rate_yearly"
                type="number"
                value={formData.interest_rate_yearly}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? 'Creating Loan...' : 'Create Loan'}
              </Button>
            </form>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {result && (
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Loan Created Successfully!
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Loan ID:</strong> {result.loan_id}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Customer ID:</strong> {result.customer_id}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Total Amount Payable:</strong> ₹{Number(result.total_amount_payable).toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  <strong>Monthly EMI:</strong> ₹{Number(result.monthly_emi).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Calculation Details
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Simple Interest Formula:</strong> I = P × N × (R/100)
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Total Amount:</strong> Principal + Total Interest
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Monthly EMI:</strong> Total Amount ÷ (Years × 12)
            </Typography>
            <Typography variant="body2">
              Where: P = Principal, N = Years, R = Interest Rate (%)
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateLoan; 