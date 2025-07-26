import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import HomePage from './pages/HomePage';
import CreateLoan from './pages/CreateLoan';
import MakePayment from './pages/MakePayment';
import ViewLedger from './pages/ViewLedger';
import CustomerOverview from './pages/CustomerOverview';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <Router basename={process.env.PUBLIC_URL}>
          <Navbar />
          <div style={{ maxWidth: 1200, margin: '32px auto', padding: 24, background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-loan" element={<CreateLoan />} />
              <Route path="/make-payment" element={<MakePayment />} />
              <Route path="/view-ledger" element={<ViewLedger />} />
              <Route path="/customer-overview" element={<CustomerOverview />} />
            </Routes>
          </div>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App; 