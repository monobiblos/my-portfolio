import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * HeroSection 컴포넌트 - 메인 비주얼 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <HeroSection />
 */
function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            textAlign: 'center',
            py: { xs: 6, md: 10 },
            px: { xs: 3, md: 6 },
            background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)',
          }}
        >
          <CardContent>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                letterSpacing: '0.2em',
                mb: 2,
                display: 'block',
              }}
            >
              HERO SECTION
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 3,
                color: 'text.primary',
              }}
            >
              여기는 Hero 섹션입니다
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default HeroSection;
