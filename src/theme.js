import { createTheme } from '@mui/material/styles';

/**
 * 다크모드 테마
 * 블랙 배경 + 보라색 포인트 컬러 + Pretendard 폰트
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C4B5FD',
      light: '#DDD6FE',
      dark: '#A78BFA',
    },
    secondary: {
      main: '#A78BFA',
      light: '#C4B5FD',
      dark: '#8B5CF6',
    },
    background: {
      default: '#000000',
      paper: '#0A0A0A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
    },
    divider: 'rgba(196, 181, 253, 0.2)',
  },
  typography: {
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    letterSpacing: '-0.01em',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '-0.01em',
    },
    button: {
      letterSpacing: '-0.01em',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 2,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 0 20px rgba(196, 181, 253, 0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(196, 181, 253, 0.5)',
          '&:hover': {
            borderColor: '#C4B5FD',
            backgroundColor: 'rgba(196, 181, 253, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A0A0A',
          border: '1px solid rgba(196, 181, 253, 0.15)',
          '&:hover': {
            borderColor: 'rgba(196, 181, 253, 0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(196, 181, 253, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
