import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  useMediaQuery,
  CssBaseline,
  Typography,
  IconButton,
} from '@mui/material';

import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HomeIcon from '@mui/icons-material/Home';
import Person from '@mui/icons-material/Person';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import logo from './Images/vvcmclogo.jpg';
import './Sidebar.css';

/* ================= APP BAR ================= */

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  // backgroundColor: '#20B2AA',
  boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
}));

/* ================= COMPONENT ================= */

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    localStorage.removeItem('resdata');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const menuItems = [
    { label: 'Voters', icon: <HomeIcon />, path: '/' },
    // { label: 'Voters', icon: <Person />, path: '/votermaster' },
      // { label: 'FinalVoters', icon: <Person />, path: '/finalvoters' },
    { label: 'Users', icon: <Person />, path: '/users' },
    // { label: 'Roles', icon: <AccessibilityIcon />, path: '/rolemaster' },
  ];

  if (isAuthPage) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />

      {/* ================= TOP STICKY NAV BAR ================= */}
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* LEFT : LOGO */}
          {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={logo} alt="logo" height="40" />
          </Box> */}

          {/* CENTER GREEN NAV */}
       
            <Box
              sx={{
                width: isMobile?'100%':'70%',
                mx: 'auto',
                backgroundColor: '#fff',
                borderRadius: '999px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 1,
              }}
            >
              <Box sx={{ display: 'flex', gap: 3 }}>
                {menuItems.map((item) => (
                  <Typography
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color:
                        location.pathname === item.path
                          ? '#000'
                          : '#000',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      borderBottom:
                        location.pathname === item.path
                          ? '2px solid #000'
                          : 'none',
                      pb: '2px',
                      '&:hover': { color: '#1c1e1dff' },
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Box>

              <Button
                onClick={handleLogout}
                sx={{
                  backgroundColor: '#E9FFF4',
                  color: '#0B4F3F',
                  fontWeight: 'bold',
                  borderRadius: '999px',
                  px: 3,
                }}
              >
                Logout
              </Button>
            </Box>
          

          {/* RIGHT (mobile logout only) */}
        
        </Toolbar>
      </AppBar>

      {/* ================= MAIN CONTENT ================= */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} />
    </Box>
  );
}
