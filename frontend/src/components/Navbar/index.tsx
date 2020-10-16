import React, {useState} from 'react';
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
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();
    const open = Boolean(anchorEl);

    const handleOpen = (event:any) => setAnchorEl(event.currentTarget);
    

    const handleClose = () => setAnchorEl(null);
    
  return (
    <AppBar>
        <Toolbar className={classes.toolbar}>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpen}
            >
                <MenuIcon />
            </IconButton>

            <Menu
                id="menu-appbar"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
                getContentAnchorEl={null}
            >
                <MenuItem
                    onClick={handleClose}
                >
                    Categorias
                </MenuItem>
            </Menu>

            <Typography className={classes.title}>
                <img src={logo} alt="Codeflix"/>
            </Typography>
            <Button color="inherit">Login</Button>
        </Toolbar>
    </AppBar>
  );    
}

