import React from 'react';
import {Navbar} from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import {BrowserRouter} from 'react-router-dom';
import { Box } from '@material-ui/core';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Box paddingTop={"70px"}>
        <Breadcrumbs />
        <AppRouter />
      </Box>
    </BrowserRouter>
  );
}

export default App;
