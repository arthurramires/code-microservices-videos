import React, {useState} from 'react';
import { 
    makeStyles, 
    Theme, 
    IconButton, 
    Menu as MuiMenu, 
    MenuItem,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import routes, { MyRouteProps } from '../../routes';

export const Menu: React.FC = () => {
    const listRoutes = ['dashboard', 'categories.list'];
    const menuRoutes = routes.filter(route => listRoutes.includes(route.name));
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event:any) => setAnchorEl(event.currentTarget);
    

    const handleClose = () => setAnchorEl(null);
    
  return (
        <>
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

            <MuiMenu
                id="menu-appbar"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
                getContentAnchorEl={null}
            >
                {
                    listRoutes.map(
                        (routeName, key) => {
                            const routes = menuRoutes.find(route => route.name === routeName) as MyRouteProps
                            return (
                                <MenuItem
                                    key={key}
                                    component={Link}
                                    to={routes.path as string}
                                    onClick={handleClose}
                                >
                                    {routes.label}
                                </MenuItem>
                            );
                        }
                    )
                }
            </MuiMenu>
        </>
  );    
}
