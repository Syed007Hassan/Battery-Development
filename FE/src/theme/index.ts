import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#00ACC1',
      light: '#5DDEF4',
      dark: '#007C91',
    },
    background: {
      default: '#F5FBFD',
      paper: '#ffffff',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#546E7A',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      textAlign: 'center',
      color: '#2C3E50',
      marginBottom: '1.5rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#F5FBFD',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00ACC1',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: '0 0 0 2px rgba(0, 172, 193, 0.2)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 172, 193, 0.08)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '2rem',
          paddingBottom: '2rem',
        },
      },
    },
  },
}); 