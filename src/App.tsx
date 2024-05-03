import React from 'react';
import logo from './logo.svg';
import './App.css';
import {AuthProvider} from './Context/AuthProvider';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme/Theme';
import { RouterProvider } from 'react-router-dom';
import Router from './Routes/Router';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        {/* <ErrorBoundary> */}
          <RouterProvider router={Router} />
        {/* </ErrorBoundary> */}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
