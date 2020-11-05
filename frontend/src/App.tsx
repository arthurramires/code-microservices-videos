import React from 'react';
import {Navbar} from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import {BrowserRouter} from 'react-router-dom';
import { Box } from '@material-ui/core';
import AppRouter from './routes/AppRouter';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from './components/SnackbarProvider';
import theme from './theme';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <Box paddingTop={"70px"}>
            <Breadcrumbs />
            <AppRouter />
          </Box>
        </BrowserRouter>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

export default App;
