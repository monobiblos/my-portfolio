import { memo } from 'react';
import Box from '@mui/material/Box';

const PageTransition = memo(function PageTransition({ active = false }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'all' : 'none',
        transition: 'opacity 0.35s ease',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          border: '3px solid rgba(196,181,253,0.2)',
          borderTopColor: '#C4B5FD',
          borderRadius: '50%',
          animation: active ? 'spin 0.8s linear infinite' : 'none',
          '@keyframes spin': {
            to: { transform: 'rotate(360deg)' },
          },
        }}
      />
    </Box>
  );
});

export default PageTransition;
