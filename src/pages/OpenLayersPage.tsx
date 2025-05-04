import { Box } from '@mui/material';
import React from 'react';
import MapComp from '../features/map/MapComp';

export default function OpenLayersPage() {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    >
      <MapComp></MapComp>
    </Box>
  );
}
