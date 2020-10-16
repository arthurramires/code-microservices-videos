import React, {useState} from 'react';
import {
    AppBar, 
    Toolbar,
    Typography, 
    Button, 
    makeStyles, 
    Theme, 
} from '@material-ui/core';
import logo from '../../static/img/logo.png';
import {Menu} from './Menu';

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
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();
  return (
    <AppBar>
        <Toolbar className={classes.toolbar}>
            <Menu />
            <Typography className={classes.title}>
                <img src={logo} alt="Codeflix"/>
            </Typography>
            <Button color="inherit">Login</Button>
        </Toolbar>
    </AppBar>
  );    
}

