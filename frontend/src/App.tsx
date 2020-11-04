import React from 'react';
import {Navbar} from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import {BrowserRouter} from 'react-router-dom';
import { Box } from '@material-ui/core';
import AppRouter from './routes/AppRouter';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import theme from './theme';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Box paddingTop={"70px"}>
          <Breadcrumbs />
          <AppRouter />
        </Box>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
