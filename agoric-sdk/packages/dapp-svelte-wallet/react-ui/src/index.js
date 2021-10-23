/* eslint-disable import/no-extraneous-dependencies */
import '@agoric/eventual-send/shim';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@material-ui/core';
import App from './App.js';
import ApplicationContextProvider from './contexts/Application';

Error.stackTraceLimit = Infinity;

const appTheme = createTheme({
  palette: {
    primary: {
      main: '#cb2328',
    },
    secondary: {
      main: 'hsla(0,0%,39.2%,.2)',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    fontWeightRegular: 500,
    h1: {
      fontFamily: ['Montserrat', 'Arial', 'sans-serif'].join(','),
      fontSize: '32px',
      fontWeight: '700',
      letterSpacing: '-1.5px',
      lineHeight: '48px',
      margin: 0,
    },
  },
  appBarHeight: '64px',
  navMenuWidth: '240px',
});

ReactDOM.render(
  <ApplicationContextProvider>
    <Router>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Router>
  </ApplicationContextProvider>,
  document.getElementById('root'),
);
