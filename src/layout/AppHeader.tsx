import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { useDrawerStore } from '../stores/drawer-store';
import { useThemeStore } from '../stores/theme-store';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { createSelectors } from '../utils/create-selectors';

export default function AppHeader() {
  const drawerStoreSelectors = createSelectors(useDrawerStore);
  const toggleDrawer = drawerStoreSelectors.use.toggle();
  const themeStoreSelectors = createSelectors(useThemeStore);
  const themeMode = themeStoreSelectors.use.mode();
  const themeToggleMode = themeStoreSelectors.use.toggleMode();
  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: 'background.default',
        }}
      >
        <Toolbar disableGutters>
          <img
            // src="london-transport-white.svg"
            src={
              themeMode === 'light'
                ? 'london-transport-light.svg'
                : 'london-transport-dark.svg'
            }
            alt="london-transport"
            className="h-16 mr-2"
          ></img>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: 'left',
            }}
          >
            {/* Petlondon */}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={themeToggleMode}
            sx={{ mr: '1rem' }}
          >
            {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}
