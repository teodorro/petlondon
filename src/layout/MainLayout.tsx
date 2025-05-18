import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useDrawerStore } from '../stores/drawer-store';
import Sidebar from '../features/sidebar';
import AppHeader from './AppHeader';

const drawerWidth = 200;

export const MainLayout = () => {
  const open = useDrawerStore((s) => s.open);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader />
      <Toolbar sx={{ border: '2px solid #0a0', height: '64px' }} />
      <Box sx={{ display: 'flex', flex: 1, width: '100vw' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            m: '0.4rem',
            ml: open ? `${drawerWidth}px` : '0.4rem',
            borderRadius: '1rem',
          }}
          className="relative bg-gray-200"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
