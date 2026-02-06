import { memo, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import { Link } from 'react-router-dom';
import { aboutMeData, getHomeSections } from '../../data/portfolio-data';

/**
 * AboutSection 컴포넌트 - 간단한 자기소개 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <AboutSection />
 */
const AboutSection = memo(function AboutSection() {
  // useMemo로 홈에 표시할 섹션 캐싱
  const homeSections = useMemo(() => getHomeSections(), []);

  // 첫 번째 섹션 (My Story)과 두 번째 섹션 (My Philosophy) 가져오기
  const storySection = useMemo(() =>
    homeSections.find((s) => s.title === 'My Story'),
    [homeSections]
  );
  const philosophySection = useMemo(() =>
    homeSections.find((s) => s.title === 'My Philosophy'),
    [homeSections]
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
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Card
            sx={{
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
                {aboutMeData.basicInfo.name}
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
                    color: 'text.secondary',
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
                variant="outlined"
                component={Link}
                to="/about"
                aria-label="자기소개 페이지로 이동"
                sx={{
                  px: 4,
                  py: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  '&:focus': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
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
