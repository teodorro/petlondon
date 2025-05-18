import React from 'react';
import ModeNumberLines from '../features/d3charts/ModeNumberLines';
import { Box } from '@mui/material';
import Changing from '../features/d3charts/changing';

export default function D3Page() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        p: 1,
      }}
    >
      <ModeNumberLines></ModeNumberLines>
      {/* <Changing></Changing> */}
    </Box>
  );
}
