'use client';
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: { mode: 'light', primary: { main: '#1976d2' } },
    typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

export default function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}