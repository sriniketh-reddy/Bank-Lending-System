import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper
} from '@mui/material';
import {
  AccountBalance,
  Payment,
  Receipt,
  Person
} from '@mui/icons-material';

const HomePage = () => {
  const features = [
    {
      title: 'Create Loan',
      description: 'Create new loans for customers with principal amount, interest rate, and loan period',
      icon: <AccountBalance color="primary" sx={{ fontSize: 40 }} />
    },
    {
      title: 'Make Payment',
      description: 'Record EMI or lump sum payments against existing loans',
      icon: <Payment color="primary" sx={{ fontSize: 40 }} />
    },
    {
      title: 'View Ledger',
      description: 'View complete transaction history and current status of any loan',
      icon: <Receipt color="primary" sx={{ fontSize: 40 }} />
    },
    {
      title: 'Customer Overview',
      description: 'Get a summary of all loans associated with a customer',
      icon: <Person color="primary" sx={{ fontSize: 40 }} />
    }
  ];

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to Bank Lending System
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
          A comprehensive loan management solution
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          System Features
        </Typography>
        <Typography variant="body1" paragraph>
          This bank lending system provides a complete solution for loan management with the following capabilities:
        </Typography>
        <ul>
          <Typography component="li" variant="body1">
            <strong>Loan Creation:</strong> Create loans with simple interest calculation
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Payment Processing:</strong> Record EMI and lump sum payments
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Ledger Management:</strong> View complete transaction history
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Customer Overview:</strong> Get comprehensive customer loan summaries
          </Typography>
        </ul>
      </Paper>
    </Box>
  );
};

export default HomePage; 