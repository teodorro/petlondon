import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import { useDrawerStore } from '../stores/drawer-store';

const drawerWidth = 240;

export const MainLayout = () => {
  const open = useDrawerStore((s) => s.open);
  const toggle = useDrawerStore((s) => s.toggle);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: 1201, ml: open ? `${drawerWidth}px` : 0 }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Petlondon</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {/* Your drawer content here */}
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, ml: open ? `${drawerWidth}px` : 0 }}
      >
        <Toolbar /> {/* Push content below AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};
