import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

/**
 * ProjectsSection 컴포넌트 - 대표작 미리보기 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <ProjectsSection />
 */
function ProjectsSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            textAlign: 'center',
            py: { xs: 5, md: 8 },
            px: { xs: 3, md: 6 },
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
              PROJECTS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                mb: 3,
                color: 'text.primary',
              }}
            >
              여기는 Projects 섹션입니다
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 500,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.8,
              }}
            >
              대표작 썸네일 3-4개와 더 보기 버튼이 들어갈 예정입니다.
            </Typography>
            <Button
              variant="outlined"
              component={Link}
              to="/projects"
              sx={{ px: 4, py: 1 }}
            >
              더 보기
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ProjectsSection;
