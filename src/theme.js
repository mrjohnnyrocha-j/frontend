// src/theme.js

import { createTheme } from '@mui/material/styles';
import { red, green, blue, grey } from '@mui/material/colors';

// Common settings shared between light and dark themes
const commonSettings = {
  typography: {
    fontFamily: 'Arial, sans-serif', // Matches your body font-family
    h1: {
      fontSize: '2.2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase transformation
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${grey[300]}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          padding: '24px',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(56, 151, 158, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(56, 151, 158, 0.15)',
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#38979e', // Primary color for tab indicator
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          '&.Mui-selected': {
            color: '#38979e',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '8px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.875rem',
          borderRadius: '8px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#38979e',
          color: '#ffffff',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
        input: {
          padding: '8px 12px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '8px 12px',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#38979e',
          '&.Mui-checked': {
            color: '#38979e',
          },
        },
      },
    },
  },
};

// Light Theme Configuration
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#38979e', // Accent color
      contrastText: '#ffffff',
    },
    secondary: {
      main: blue[600],
      contrastText: '#ffffff',
    },
    error: {
      main: red.A400,
    },
    success: {
      main: green[600],
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
    action: {
      hover: grey[200],
      selected: grey[300],
      disabled: grey[400],
    },
    warning: {
      main: '#ff9800',
      light: '#fff3e0',
    },
    info: {
      main: '#2196f3',
      light: '#e3f2fd',
    },
  },
  ...commonSettings,
});

// Dark Theme Configuration
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#38979e', // Accent color
      contrastText: '#ffffff',
    },
    secondary: {
      main: blue[200],
      contrastText: '#ffffff',
    },
    error: {
      main: red[400],
    },
    success: {
      main: green[400],
    },
    background: {
      default: '#1c1b1b',
      paper: '#2a2a2a',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(233, 248, 247, 0.87)',
    },
    action: {
      hover: grey[700],
      selected: grey[800],
      disabled: grey[600],
    },
    warning: {
      main: '#ffcc80',
      light: '#ffe0b2',
    },
    info: {
      main: '#64b5f6',
      light: '#bbdefb',
    },
  },
  ...commonSettings,
});
