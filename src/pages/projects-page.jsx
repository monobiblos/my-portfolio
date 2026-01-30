import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { supabase } from '../utils/supabase';

/**
 * ProjectsPage 컴포넌트 - Projects 상세 페이지
 *
 * Props: 없음
 *
 * Example usage:
 * <ProjectsPage />
 */
function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('프로젝트 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        py: { xs: 10, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
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
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 3,
              color: 'text.primary',
            }}
          >
            프로젝트
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
            React와 다양한 기술 스택을 활용하여 개발한 프로젝트들입니다.
            각 프로젝트의 썸네일을 클릭하면 실제 사이트로 이동합니다.
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4].map((item) => (
              <Grid key={item} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card>
                  <Skeleton variant="rectangular" height={220} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="80%" />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Skeleton variant="rounded" width={60} height={24} />
                      <Skeleton variant="rounded" width={60} height={24} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : projects.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              아직 등록된 프로젝트가 없습니다
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {projects.map((project) => (
              <Grid key={project.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 12px 40px rgba(196, 181, 253, 0.35)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={project.thumbnail_url}
                      alt={project.title}
                      sx={{
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.08)',
                        },
                      }}
                      onClick={() => window.open(project.detail_url, '_blank')}
                    />
                    <IconButton
                      component="a"
                      href={project.detail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'primary.main',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'background.default',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: '1.15rem', md: '1.3rem' },
                        mb: 1.5,
                        color: 'text.primary',
                        fontWeight: 600,
                      }}
                    >
                      {project.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 2.5,
                        lineHeight: 1.7,
                        minHeight: { xs: 'auto', md: 60 },
                      }}
                    >
                      {project.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {project.tech_stack?.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(196, 181, 253, 0.15)',
                            color: 'primary.main',
                            fontSize: '0.75rem',
                            height: 26,
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: 'rgba(196, 181, 253, 0.25)',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default ProjectsPage;
