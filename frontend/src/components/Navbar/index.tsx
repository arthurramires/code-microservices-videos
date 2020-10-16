import * as React from 'react';
import {
    AppBar, 
    Toolbar,
    Typography, 
    Button, 
    makeStyles, 
    Theme, 
    IconButton, 
    Menu, 
    MenuItem
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import logo from '../../static/img/logo.png';

const useStyles = makeStyles((theme: Theme) => ({
    toolbar: {
        backgroundColor: '#000000',
    },
    title: {
        flexGrow: 1,
        textAlign: 'center'
    }, 
    logo: {
        width: 100,
        [theme.breakpoints.up('sm')]: {
            widht: 170
        }
    }
}));

export const Navbar: React.FC = () => {
    const classes = useStyles();
  return (
    <AppBar>
        <Toolbar className={classes.toolbar}>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                aria-controls="menu-appbar"
                aria-haspopup="true"
            >
                <MenuIcon />
            </IconButton>

            <Menu
                id="menu-appbar"
                open={true}
            >
                <MenuItem>Categorias</MenuItem>
            </Menu>

            <Typography className={classes.title}>
                <img src={logo} alt="Codeflix"/>
            </Typography>
            <Button color="inherit">Login</Button>
        </Toolbar>
    </AppBar>
  );    
}

