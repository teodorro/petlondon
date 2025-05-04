import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getAppTheme } from './index';
import { useThemeStore } from '../stores/theme-store';

export const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const mode = useThemeStore((s) => s.mode);
  const theme = React.useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
