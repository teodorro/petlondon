import React, { useEffect } from 'react';
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

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary-color', theme.palette.primary.main);
    root.style.setProperty(
      '--theme-secondary-color',
      theme.palette.secondary.main
    );
    root.style.setProperty(
      '--theme-background-color',
      theme.palette.background.default
    );
    root.style.setProperty(
      '--theme-text-primary-color',
      theme.palette.text.primary
    );
    root.style.setProperty(
      '--theme-text-secondary-color',
      theme.palette.text.secondary
    );
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
