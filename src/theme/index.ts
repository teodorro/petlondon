import { createTheme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette.ts';
import { typography } from './typography.ts';

export const getAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    typography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            textTransform: 'none',
          },
        },
      },
      // other components...
    },
  });