import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import useAuth from '../Hooks/UseAuth';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import LoginPage from '../Pages/Auth/Login';
import Layout from './Layout';
import Logo from '../Assets/logo.png';
import IUserLogin from '../Pages/Auth/Interface/IUserLogin';
import { useNavigate } from 'react-router-dom';

const pages = ['Home', 'About', 'Product', 'Contact Us'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function stringAvatar(name: string) {
  return {
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

function RootLayout() {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { isAuthenticated } = useAuth();
  const fulleName = window.localStorage.getItem('fullName') as string;
  const userName = window.localStorage.getItem('userName') as string;
  const auth = useAuth();
  const navigate = useNavigate();

  const [login] = useState<IUserLogin>({
    Username: userName || "",
    Password: ""
  });

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  if (isAuthenticated) {
    const token = Cookies.get('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
  }, [isAuthenticated]);

  const handleSignOut = () => 
  {
    const url = `${REACT_APP_API_ENDPOINT}/UserAuth/Logout`;
    axios.post(url, login)
      .then(response => {
        var result = response.data;
        if(result.Message === 'Logout Successful')
        {
          auth.signOut();
          navigate('/');
        }
      }
    ).catch(error => {
      console.error("Error saving data:", error);
    })
  };


  return (
    <Box sx={{ paddingTop: '30px' }}>
      <AppBar position="static" sx={{ background: 'transparent', color: 'black', boxShadow: 'none' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon sx={{ fontSize: '40px' }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none',  },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu} sx={{ fontSize: '20px', }}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'black', display: 'block',  fontSize: '25px', marginLeft: '50px' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={{   
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none', 
            }}>
              <img src={Logo} alt="Logo" />
            </Box>
            <Box 
              sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
            >
              <img src={Logo} alt="Logo" />
            </Box>
            { isAuthenticated ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, }}>
                    <Avatar sx={{ height: '50px', width: '50px', backgroundColor: '#00A1E4', color:'#FFF' }} {...stringAvatar(fulleName)} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={setting === 'Logout' ? handleSignOut : handleCloseUserMenu}
                      sx={{ fontSize: '20px' }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              null
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {!isAuthenticated ? (
        <Box>
          <LoginPage />
        </Box>
      ) : (
        <Box>
          <Layout />
        </Box>
      )}
    </Box>
  );
}
export default RootLayout;
