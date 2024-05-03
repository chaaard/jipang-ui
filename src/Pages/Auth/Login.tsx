import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Alert, Box, Button, Divider, Fade, Grid, IconButton, InputAdornment, Snackbar, TextField, Typography, styled } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios, { AxiosRequestConfig } from 'axios';
import  useAuth   from '../../Hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import IUserLogin from './Interface/IUserLogin';
import LoginMessage from '../../Assets/loginmessage.png';
import Product from '../../Assets/product.png';

const WhiteAlert = styled(Alert)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const BootstrapButton = styled(IconButton)(({ theme }) => ({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 30, 
  width: '250px',
  padding: '6px 12px',
  fontFamily: 'Hanken Grotesk',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#ffffff',
  borderColor: '#ffffff',
  color: '#01A2E4',
  '&:hover': {
    backgroundColor: '#01A2E4',
    borderColor: '#ffffff',
    color: '#ffffff',
  },
  borderRadius: '30px', // Ensure the button has the default shape
}));

interface UserInfo {
  Role: string | null | undefined,
  Club: string | null | undefined
}

const LoginPage = () => {

const navigate = useNavigate();
const auth = useAuth();
const { REACT_APP_API_ENDPOINT } = process.env;
const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success');
const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
const [errorMessage, setErrorMessage] = useState<string>('');
const [successMessage, setSuccessMessage] = useState<string>('');
const [submitted, setSubmitted] = useState<boolean>(false);
const [showPassword, setShowPassword] = useState<boolean>(false);
const [login, setLogin] = useState<IUserLogin>({
  Username: "",
  Password: ""
});
const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
const userName = window.localStorage.getItem('userName');

useEffect(() => {
  document.title = 'CSI | Login';
}, []);

const handleClickShowPassword = () => setShowPassword((show) => !show);

const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

const handleLoginSubmit = () => {
  
  setSubmitted(true);
  if (!login.Username || !login.Password ) {
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Please input required fields.');
    return;
  }
  const url = `${REACT_APP_API_ENDPOINT}/Auth/Login`;
  axios.post(url, login)
    .then(response => {
      var result = response.data;
      if(result.Message !== 'User is already logged in.')
      {
        auth.signIn(result); 
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setSuccessMessage('Login successfully!')
        setSubmitted(true);
        setTimeout(() => {
          setIsSnackbarOpen(false); 
            result.RoleId === 1 ? 
            navigate('accounting/dashboard-accounting') :  
            result.RoleId === 2 ? 
            navigate('treasury/dashboard-treasury') : 
            result.RoleId === 4 ? 
            navigate('system-admin/dashboard-system-admin') : 
            navigate('maintenance')
          window.location.reload()
        }, 1000,);
      }
      else if(result.Message === 'Incorrect username/password.')
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setErrorMessage('Incorrect username/password.')
        setLogin({
          Username: "",
          Password: ""
        })
      }
      else if(result.Message === 'User not found.')
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setErrorMessage('User not found.')
        setLogin({
          Username: "",
          Password: ""
        })
      }
      else
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setErrorMessage('User is already logged in.')
      }
    }
).catch(error => {
  if (error.response && error.response.status === 401) {
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Invalid credentials. Please try again.');
    setSubmitted(false);
    setLogin({
      Username: "",
      Password: ""
    })
  } else {
    console.error('Login failed:', error);
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Incorrect username/password.');
    setSubmitted(false);
    setLogin({
      Username: "",
      Password: ""
    })
  }
  });
}

const handleLoginADSubmit = () => {
  const url = `${REACT_APP_API_ENDPOINT}/Auth/LoginAD`;
  axios.post(url)
    .then(response => {
      var result = response.data;
      if(result.Message !== 'User is already logged in.')
      {
        auth.signIn(result); 
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setSuccessMessage('Login successfully!')
        
        setTimeout(() => {
          setIsSnackbarOpen(false); 
          navigate('/');
          window.location.reload()
        }, 1000);
      }
      else
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setErrorMessage('User is already logged in.')
      }
    }
).catch(error => {
  if (error.response && error.response.status === 401) {
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Invalid credentials. Please try again.');
  } else {
    console.error('Login failed:', error);
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Error occurred. Please try again.');
  }
  });
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name: inputName, value } = event.target;
  const updatedFormData = {
    ...login,
    [inputName]: value,
  };

  setLogin(updatedFormData);
};

const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === 'clickaway') {
    return;
  }

  setIsSnackbarOpen(false);
};

return (
  <Box 
    sx={{ 
      flexGrow: 1, 
      height: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
    <Grid container spacing={8} direction="row" justifyContent="center" alignItems="center">
      <Grid item>
        <Box 
          sx={{ 
            textAlign: 'center', 
            color: '#1C2C5A',
            marginBottom: '40px',
          }}>
          <img src={Product} alt="Product" width={'700px'}/>
        </Box>
      </Grid>
      <Grid item>
        <Card 
          sx={{ 
            padding: '20px', 
            borderRadius: 7, 
            mb: 4,
          }}>
          <Box>
            <CardContent 
              sx={{ 
                padding: '16px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
              }}>
              <Box 
                sx={{ 
                  paddingTop: '8px', 
                  width: '100%' 
                }}>
                <TextField 
                  InputProps={{sx: { borderRadius: 4 }}}
                  fullWidth
                  sx={{ PaddingLeft: '100px'}}
                  label='Username'
                  name='Username'
                  onChange={handleChange}
                  value={login.Username}
                  required
                  error={submitted && login.Username === ""}
                  helperText={submitted && login.Username === "" && "Username is required"}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleLoginSubmit();
                    }
                  }}
                />
              </Box>
              <Box sx={{ paddingTop: '3%', width: '100%' }}>
                <TextField 
                  InputProps={{sx: { borderRadius: 4 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                    )
                  }}
                  fullWidth
                  label='Password'
                  name='Password'
                  type={showPassword ? 'text' : 'password'}
                  value={login.Password}
                  onChange={handleChange}
                  required
                  error={submitted && login.Password === ""}
                  helperText={submitted && login.Password === "" && "Password is required"}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleLoginSubmit();
                    }
                  }}
                />
              </Box>
              <Box sx={{ paddingTop: '4%', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <img src={LoginMessage} alt="Message" />
              </Box>
            </CardContent>
          </Box>
        </Card>
        <Box>
          <Typography sx={{ fontSize: '20px', marginLeft: '20px', marginBottom: '10px', fontFamily: 'Hanken Grotesk' }}>
            Forgot Password
          </Typography>
        </Box> 
        <Box sx={{ width: '300px', }}>
          <BootstrapButton>
            LOG IN
          </BootstrapButton>
        </Box> 
      </Grid>
    </Grid>
    <Snackbar
      open={isSnackbarOpen}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      TransitionComponent={Fade} 
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <WhiteAlert variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarSeverity === 'success' ? successMessage : errorMessage}
      </WhiteAlert>
    </Snackbar>
  </Box>
  );
}

export default LoginPage;