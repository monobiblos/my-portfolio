import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * SkillTreeSection 컴포넌트 - 기술 스택 시각화 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <SkillTreeSection />
 */
function SkillTreeSection() {
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
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(196, 181, 253, 0.05) 100%)',
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
              SKILL TREE
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                mb: 3,
                color: 'text.primary',
              }}
            >
              여기는 Skill Tree 섹션입니다
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
              기술 스택을 트리나 프로그레스바로 시각화할 예정입니다.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default SkillTreeSection;
