import { memo, useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import { Link } from 'react-router-dom';
import { getHomeSections } from '../../data/portfolio-data';
import { supabase } from '../../utils/supabase';

/**
 * AboutSection 컴포넌트 - 간단한 자기소개 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <AboutSection />
 */
const AboutSection = memo(function AboutSection() {
  const [sections, setSections] = useState(null);

  useEffect(() => {
    supabase
      .from('about_sections')
      .select('*')
      .eq('show_in_home', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data?.length > 0) setSections(data);
        else setSections(getHomeSections());
      })
      .catch(() => setSections(getHomeSections()));
  }, []);

  const displaySections = useMemo(() => sections || getHomeSections(), [sections]);

  const storySection = useMemo(() =>
    displaySections.find((s) => s.title === 'My Story'),
    [displaySections]
  );
  const philosophySection = useMemo(() =>
    displaySections.find((s) => s.title === 'My Philosophy'),
    [displaySections]
  );

  return (
    <Box
      component="section"
      aria-labelledby="about-section-title"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative' }}>
        {/* 배경 꽃 일러스트 */}
        <Box
          component="svg"
          viewBox="0 0 400 300"
          sx={{
            position: 'absolute',
            bottom: { xs: -40, md: -60 },
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: 280, md: 400 },
            height: { xs: 210, md: 300 },
            opacity: 0.15,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {/* 꽃잎들 */}
          <ellipse cx="200" cy="120" rx="45" ry="70" fill="none" stroke="#a78bfa" strokeWidth="1.5" transform="rotate(0 200 120)" />
          <ellipse cx="200" cy="120" rx="45" ry="70" fill="none" stroke="#a78bfa" strokeWidth="1.5" transform="rotate(60 200 120)" />
          <ellipse cx="200" cy="120" rx="45" ry="70" fill="none" stroke="#a78bfa" strokeWidth="1.5" transform="rotate(120 200 120)" />
          <ellipse cx="200" cy="120" rx="45" ry="70" fill="none" stroke="#a78bfa" strokeWidth="1.5" transform="rotate(180 200 120)" />
          <ellipse cx="200" cy="120" rx="45" ry="70" fill="none" stroke="#a78bfa" strokeWidth="1.5" transform="rotate(240 200 120)" />
          <ellipse cx="200" cy="120" rx="45" ry="70" fill="none" stroke="#a78bfa" strokeWidth="1.5" transform="rotate(300 200 120)" />
          {/* 꽃 중심 */}
          <circle cx="200" cy="120" r="25" fill="none" stroke="#c4b5fd" strokeWidth="2" />
          <circle cx="200" cy="120" r="12" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          {/* 줄기 */}
          <path d="M200 170 Q200 220, 200 280" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          {/* 잎사귀 */}
          <path d="M200 210 Q160 200, 150 230 Q170 220, 200 220" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          <path d="M200 240 Q240 230, 250 260 Q230 250, 200 250" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
        </Box>

        <Fade in timeout={800}>
          <Card
            sx={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              py: { xs: 5, md: 8 },
              px: { xs: 3, md: 6 },
              background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(196, 181, 253, 0.15)',
              },
              '&:focus-within': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '4px',
              },
            }}
          >
            <CardContent>
              <Typography
                variant="overline"
                component="span"
                sx={{
                  color: 'primary.main',
                  letterSpacing: '0.2em',
                  mb: 2,
                  display: 'block',
                }}
              >
                ABOUT ME
              </Typography>
              <Typography
                id="about-section-title"
                variant="h2"
                component="h2"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                나에 대하여
              </Typography>
              {storySection && (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 500,
                    mx: 'auto',
                    mb: 2,
                    lineHeight: 1.8,
                  }}
                >
                  {storySection.content}
                </Typography>
              )}
              {philosophySection && (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'primary.main',
                    maxWidth: 500,
                    mx: 'auto',
                    mb: 4,
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                  }}
                >
                  "{philosophySection.content}"
                </Typography>
              )}
              <Button
                variant="contained"
                component={Link}
                to="/about"
                aria-label="자기소개 페이지로 이동"
                sx={{
                  px: 4,
                  py: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 600,
                  transition: 'all 0.4s ease',
                  zIndex: 1,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'primary.main',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.4s ease',
                    zIndex: -1,
                  },
                  '&:hover': {
                    color: '#ffffff',
                    backgroundColor: 'transparent',
                    '&::before': {
                      transform: 'scaleX(1)',
                    },
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                }}
              >
                더 알아보기
              </Button>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
});

export default AboutSection;
