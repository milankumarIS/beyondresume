import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

interface LoaderProps {
  isOpen: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isOpen }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
      }}
      open={isOpen}
    >
      <CircularProgress color="inherit" />
      <Box mt={2}>
        <Typography variant="body1" sx={{ fontSize: '16px' }}>
          Please wait...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default Loader;
