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
  Chip,
  MenuItem
} from '@mui/material';
import { Person } from '@mui/icons-material';
import axios from 'axios';

const CustomerOverview = () => {
  const [customerId, setCustomerId] = useState('');
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const customers = [
    { id: 'CUST001', name: 'Amit Sharma' },
    { id: 'CUST002', name: 'Priya Singh' },
    { id: 'CUST003', name: 'Rahul Verma' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOverview(null);

    try {
      const response = await axios.get(`/api/v1/customers/${customerId}/overview`);
      setOverview(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch customer overview');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Person sx={{ mr: 2, fontSize: 40 }} color="primary" />
          <Typography variant="h4" component="h1">
            Customer Overview
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View a summary of all loans associated with a customer.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Customer
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                select
                fullWidth
                label="Customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                margin="normal"
                required
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.id})
                  </MenuItem>
                ))}
              </TextField>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View Overview'}
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
          {overview && (
            <Box>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customer Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Customer ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {overview.customer_id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Customer Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {overview.customer_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Loans
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {overview.total_loans}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Paper elevation={2}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Loan Details
                  </Typography>
                  {overview.loans.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Loan ID</TableCell>
                            <TableCell>Principal</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Total Interest</TableCell>
                            <TableCell>EMI Amount</TableCell>
                            <TableCell>Amount Paid</TableCell>
                            <TableCell>EMIs Left</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {overview.loans.map((loan) => (
                            <TableRow key={loan.loan_id}>
                              <TableCell>
                                <Chip label={loan.loan_id} size="small" />
                              </TableCell>
                              <TableCell>{formatCurrency(loan.principal)}</TableCell>
                              <TableCell>{formatCurrency(loan.total_amount)}</TableCell>
                              <TableCell>{formatCurrency(loan.total_interest)}</TableCell>
                              <TableCell>{formatCurrency(loan.emi_amount)}</TableCell>
                              <TableCell>{formatCurrency(loan.amount_paid)}</TableCell>
                              <TableCell>
                                <Chip
                                  label={loan.emis_left}
                                  color={loan.emis_left === 0 ? 'success' : 'warning'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Loans Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This customer has no active loans. You can create a new loan for them using the "Create Loan" feature.
                      </Typography>
                    </Box>
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

export default CustomerOverview; 