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
  CardContent,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Payment } from '@mui/icons-material';
import axios from 'axios';

const MakePayment = () => {
  const [formData, setFormData] = useState({
    loan_id: '',
    amount: '',
    payment_type: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loanDetails, setLoanDetails] = useState(null);
  const [loadingLoan, setLoadingLoan] = useState(false);

  const paymentTypes = [
    { value: 'EMI', label: 'EMI Payment' },
    { value: 'LUMP_SUM', label: 'Lump Sum Payment' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fetchLoanDetails = async (loanId) => {
    if (!loanId) {
      setLoanDetails(null);
      return;
    }
    
    setLoadingLoan(true);
    try {
      const response = await axios.get(`/api/v1/loans/${loanId}/ledger`);
      setLoanDetails(response.data);
    } catch (err) {
      setLoanDetails(null);
    } finally {
      setLoadingLoan(false);
    }
  };

  const handleLoanIdChange = (e) => {
    const loanId = e.target.value;
    setFormData({
      ...formData,
      loan_id: loanId
    });
    fetchLoanDetails(loanId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`/api/v1/loans/${formData.loan_id}/payments`, {
        amount: parseFloat(formData.amount),
        payment_type: formData.payment_type
      });
      setResult(response.data);
      setFormData({
        loan_id: '',
        amount: '',
        payment_type: ''
      });
      setLoanDetails(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Payment sx={{ mr: 2, fontSize: 40 }} color="primary" />
          <Typography variant="h4" component="h1">
            Make Payment
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Record EMI or lump sum payments against existing loans.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Loan ID"
                name="loan_id"
                value={formData.loan_id}
                onChange={handleLoanIdChange}
                margin="normal"
                required
                placeholder="Enter the loan ID"
                inputProps={{ autoComplete: 'off' }}
              />

              <TextField
                fullWidth
                label="Payment Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ min: 0, step: 0.01 }}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={handleChange}
                  label="Payment Type"
                >
                  {paymentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? 'Processing Payment...' : 'Record Payment'}
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
          {loadingLoan ? (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Loading Loan Details...
              </Typography>
            </Paper>
          ) : loanDetails ? (
            <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Loan Details
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Loan ID:</strong> {loanDetails.loan_id}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Current Balance:</strong> ₹{Number(loanDetails.balance_amount).toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  <strong>EMIs Left:</strong> {loanDetails.emis_left}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Loan Details
              </Typography>
              <Typography variant="body2">
                Enter a loan ID to see its current balance and EMIs left.
              </Typography>
            </Paper>
          )}

          {result && (
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Recorded Successfully!
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Payment ID:</strong> {result.payment_id}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Loan ID:</strong> {result.loan_id}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Remaining Balance:</strong> ₹{result.remaining_balance.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  <strong>EMIs Left:</strong> {result.emis_left}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Types
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>EMI Payment:</strong> Regular monthly installment payment
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Lump Sum Payment:</strong> One-time payment that reduces the outstanding balance
            </Typography>
            <Typography variant="body2">
              After a lump sum payment, the remaining EMIs are recalculated based on the new outstanding balance.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MakePayment; 