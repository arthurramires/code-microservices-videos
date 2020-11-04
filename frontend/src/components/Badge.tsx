import React from 'react';
import {Chip, createMuiTheme, MuiThemeProvider} from '@material-ui/core';
import theme from '../theme';

const localTheme = createMuiTheme({
    palette: {
        primary: theme.palette.success,
        secondary: theme.palette.secondary
    }
});

export const BadgeYes: React.FC = () => {
  return (
      <MuiThemeProvider theme={localTheme}>
            <Chip label="Sim" color="primary"/>
      </MuiThemeProvider>
  );
}

export const BadgeNo: React.FC = () => {
  return (
    <MuiThemeProvider theme={localTheme}>
        <Chip label="Não" color="secondary"/>
    </MuiThemeProvider>
  );
}
