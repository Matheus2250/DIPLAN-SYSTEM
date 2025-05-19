import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ title, subtitle }) {
  const navigate = useNavigate();
  
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Box className="header-content">
          <Box>
            <Typography variant="h5" component="h1" className="header-title">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle1" className="header-subtitle">
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Box>
            <Button 
              color="inherit" 
              className="header-button"
              onClick={() => navigate('/area-selection')}
            >
              Trocar Área
            </Button>
            <Button 
              color="inherit" 
              className="header-button"
              onClick={() => navigate('/')}
            >
              Sair
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;