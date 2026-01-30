import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * ContactSection 컴포넌트 - 연락처 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <ContactSection />
 */
function ContactSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            textAlign: 'center',
            py: { xs: 5, md: 8 },
            px: { xs: 3, md: 6 },
            background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(196, 181, 253, 0.3)',
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
              CONTACT
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                mb: 3,
                color: 'text.primary',
              }}
            >
              여기는 Contact 섹션입니다
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 500,
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              연락처, SNS, 간단한 메시지 폼이 들어갈 예정입니다.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ContactSection;
