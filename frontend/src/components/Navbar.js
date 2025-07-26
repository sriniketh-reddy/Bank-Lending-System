import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Home,
  Add,
  Payment,
  Receipt,
  Person,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useState } from 'react';

const navItems = [
  { text: 'Home', icon: <Home />, path: '/' },
  { text: 'Create Loan', icon: <Add />, path: '/create-loan' },
  { text: 'Make Payment', icon: <Payment />, path: '/make-payment' },
  { text: 'View Ledger', icon: <Receipt />, path: '/view-ledger' },
  { text: 'Customer Overview', icon: <Person />, path: '/customer-overview' }
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.text} component={RouterLink} to={item.path}>
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main', color: 'white', boxShadow: 2 }}>
      <Toolbar sx={{ justifyContent: { xs: 'space-between', md: 'center' } }}>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, width: '100%', justifyContent: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.text}
              component={RouterLink}
              to={item.path}
              startIcon={item.icon}
              color="inherit"
              sx={{
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)'
                }
              }}
            >
              <Typography variant="body2">
                {item.text}
              </Typography>
            </Button>
          ))}
        </Box>
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 