import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#79aec8',
            contrastText: '#FFF'
        },
        secondary: {
            main: '#4db5ab',
            contrastText: '#FFF'
        },
        background: {
            default: '#fafafa'
        }
    },
    overrides: {
        // MuiFormLabel: {
        //     root: {

        //     }
        // }
    }
});

export default theme;