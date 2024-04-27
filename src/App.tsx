import React from 'react';
import logo from './logo.svg';
import './App.css';

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
