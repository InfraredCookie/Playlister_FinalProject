import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [text, setText] = useState("");
    const isMenuOpen = Boolean(anchorEl);
    const isMenuOpen2 = Boolean(anchorEl2);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSortMenuOpen = (event) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setAnchorEl2(null);
    };

    const handleSortName = () => {
        store.sortByName();
        handleSortMenuClose();
    }

    const handleSortDate = () => {
        store.sortByDate();
        handleSortMenuClose();
    }

    const handleSortListens = () => {
        store.sortByListens();
        handleSortMenuClose();
    }

    const handleSortLikes = () => {
        store.sortByLikes();
        handleSortMenuClose();
    }
    
    const handleSortDislikes = () => {
        store.sortByDislikes();
        handleSortMenuClose();
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            store.filterPlaylists(text)
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
        store.closeList();
    }

    const handleHomeButton = () => {
        store.closeCurrentList();
        store.loadIdNamePairs();
    }

    const handleAllListsbySong = () => {
        store.closeCurrentList();
        store.loadPublishedIdNamePairs("ALL");
    }

    const handleAllListsbyUser = () => {
        store.closeCurrentList();
        store.loadPublishedIdNamePairs("USERS");
    }

    const handleCancel = () => {
        store.filterPlaylists("")
        setText("")
    }

    const menuId = 'primary-search-account-menu';
    const menuId2 = 'a'
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    const sortMenu =
        <Menu
            anchorEl={anchorEl2}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId2}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',    
            }}
            open={isMenuOpen2}
            onClose={handleSortMenuClose}
        >
            <MenuItem onClick={handleSortName}>Name (A-Z)</MenuItem>
            <MenuItem onClick={handleSortDate}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handleSortListens}>Listens (High-Low)</MenuItem>
            <MenuItem onClick={handleSortLikes}>Likes (High-Low)</MenuItem>
            <MenuItem onClick={handleSortDislikes}>Dislikes (High-Low)</MenuItem>
        </Menu>

    let editToolbar = "";
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        if (store.currentList && !store.currentList.isPublished) {
            editToolbar = <EditToolbar />;
        }
    }
    
    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        console.log("userInitials: " + userInitials);
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    function getIcons(loggedIn) {
        if (loggedIn) 
            return (
                <div>
                    <Link style={{ textDecoration: 'none', color: 'white' }} to='/'
                        onClick={handleHomeButton}
                    >
                        <HomeIcon/>
                    </Link>
                    <Link style={{ textDecoration: 'none', color: 'white' }} to='/'
                        onClick={handleAllListsbySong}
                    >
                        <PersonIcon/>
                    </Link>
                    <Link style={{ textDecoration: 'none', color: 'white' }} to='/'
                        onClick={handleAllListsbyUser}
                    >
                        <GroupIcon/>
                    </Link>  
                    <img src="/playlister.png" alt="image" width="100" height="auto"/>
                    <TextField 
                        id="standard-basic" 
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <IconButton position="end" onClick={handleCancel}>
                                    <ClearIcon/>
                                </IconButton>
                            )
                        }} 
                        variant="standard"
                        onKeyPress={handleKeyPress}
                        onChange={handleUpdateText}
                        value={text}
                    />
                </div>
            );
        else
            return (
                <div>
                    <a href="/"><img src="/playlister.png" alt="image" width="100" height="auto"/></a>
                </div>
            );
    }

    function getSort(loggedIn) {
        if (loggedIn) 
            return (
                <div>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId2}
                            aria-haspopup="true"
                            onClick={handleSortMenuOpen}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                    </Box>
                </div>
            )
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {getIcons(auth.loggedIn)}
                    <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                    {getSort(auth.loggedIn)}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            { getAccountMenu(auth.loggedIn) }
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
            {
                sortMenu
            }
        </Box>
    );
}