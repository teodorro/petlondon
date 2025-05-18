import React from 'react';
import ModeNumberLines from '../features/d3charts/ModeNumberLines';
import { Box } from '@mui/material';

export default function D3Page() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ModeNumberLines></ModeNumberLines>
    </Box>
  );
}
