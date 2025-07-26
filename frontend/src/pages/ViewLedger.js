import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { Receipt } from '@mui/icons-material';
import axios from 'axios';

const ViewLedger = () => {
  const [loanId, setLoanId] = useState('');
  const [ledger, setLedger] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLedger(null);

    try {
      const response = await axios.get(`/api/v1/loans/${loanId}/ledger`);
      setLedger(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch ledger');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Receipt sx={{ mr: 2, fontSize: 40 }} color="primary" />
          <Typography variant="h4" component="h1">
            View Loan Ledger
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View complete transaction history and current status of any loan.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Ledger
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Loan ID"
                value={loanId}
                onChange={(e) => setLoanId(e.target.value)}
                margin="normal"
                required
                placeholder="Enter the loan ID"
                inputProps={{ autoComplete: 'off' }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View Ledger'}
              </Button>
            </form>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {ledger && (
            <Box>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Loan Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Loan ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {ledger.loan_id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Customer ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {ledger.customer_id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Principal Amount
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(ledger.principal)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(ledger.total_amount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Monthly EMI
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(ledger.monthly_emi)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Amount Paid
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(ledger.amount_paid)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Balance Amount
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(ledger.balance_amount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        EMIs Left
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {ledger.emis_left}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Paper elevation={2}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Transaction History
                  </Typography>
                  {ledger.transactions.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Transaction ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Type</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {ledger.transactions.map((transaction) => (
                            <TableRow key={transaction.transaction_id}>
                              <TableCell>{formatDate(transaction.date)}</TableCell>
                              <TableCell>{transaction.transaction_id}</TableCell>
                              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                              <TableCell>
                                <Chip
                                  label={transaction.type}
                                  color={transaction.type === 'EMI' ? 'primary' : 'secondary'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No transactions found for this loan.
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewLedger; 