import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getAppTheme } from './index';
import { useThemeStore } from '../stores/theme-store';
import { createSelectors } from '../utils/create-selectors';

export const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const themeSelectors = createSelectors(useThemeStore);
  const mode = themeSelectors.use.mode();
  const theme = React.useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
