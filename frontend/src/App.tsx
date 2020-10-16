import React from 'react';
import {Navbar} from './components/Navbar';
import {Page} from './components/Page';
import './App.css';
import { Box } from '@material-ui/core';

function App() {
  return (
    <>
      <Navbar />
      <Box paddingTop={"70px"}>
        <Page title="Homepage"/>
      </Box>
    </>
  );
}

export default App;
