import { memo } from 'react';
import Box from '@mui/material/Box';

const keyframesStyle = {
  '@keyframes wave1': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-50%)' },
  },
  '@keyframes wave2': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-50%)' },
  },
  '@keyframes wave3': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-50%)' },
  },
};

const wavePath1 = 'M0,64 C160,20 320,100 480,64 C640,28 800,100 960,64 C1120,28 1280,100 1440,64 C1600,28 1760,100 1920,64 L1920,200 L0,200 Z';
const wavePath2 = 'M0,80 C200,40 360,120 520,80 C680,40 840,120 1000,80 C1160,40 1320,120 1480,80 C1640,40 1800,120 1920,80 L1920,200 L0,200 Z';
const wavePath3 = 'M0,96 C180,56 340,130 500,96 C660,62 820,130 980,96 C1140,62 1300,130 1460,96 C1620,62 1780,130 1920,96 L1920,200 L0,200 Z';

const WaveBackground = memo(function WaveBackground({ top = false }) {
  const posStyle = top
    ? { top: 0 }
    : { bottom: 0 };

  const flipStyle = top
    ? { transform: 'scaleY(-1)' }
    : {};

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: 200,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...posStyle,
        ...flipStyle,
        ...keyframesStyle,
      }}
    >
      {/* Wave layer 1 - slowest, most visible */}
      <Box
        component="svg"
        viewBox="0 0 1920 200"
        preserveAspectRatio="none"
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '200%',
          height: '100%',
          animation: 'wave1 25s linear infinite',
          opacity: 0.04,
        }}
      >
        <path d={wavePath1} fill="#ffffff" />
        <path d={wavePath1} fill="#ffffff" transform="translate(960, 0)" />
      </Box>

      {/* Wave layer 2 - medium speed */}
      <Box
        component="svg"
        viewBox="0 0 1920 200"
        preserveAspectRatio="none"
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '200%',
          height: '80%',
          animation: 'wave2 18s linear infinite',
          opacity: 0.03,
        }}
      >
        <path d={wavePath2} fill="#ffffff" />
        <path d={wavePath2} fill="#ffffff" transform="translate(960, 0)" />
      </Box>

      {/* Wave layer 3 - fastest, most subtle */}
      <Box
        component="svg"
        viewBox="0 0 1920 200"
        preserveAspectRatio="none"
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '200%',
          height: '60%',
          animation: 'wave3 12s linear infinite',
          opacity: 0.025,
        }}
      >
        <path d={wavePath3} fill="#ffffff" />
        <path d={wavePath3} fill="#ffffff" transform="translate(960, 0)" />
      </Box>
    </Box>
  );
});

export default WaveBackground;
