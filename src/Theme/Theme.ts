import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#FFFFFF',
      main: '#1C3766',
    },
    secondary: {
      main: '#4caf50',
    },
    text : {
        primary: '#000000',
    },
    background: {
      default: "#222222",
    }
  },
  typography: {
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontWeightBold: 600, 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#00A1E4',
            color: '#fff'
          },
        },
      },
    },
  },
});

export default theme;	