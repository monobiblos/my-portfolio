import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import JavascriptIcon from '@mui/icons-material/Javascript';
import BrushIcon from '@mui/icons-material/Brush';
import CodeIcon from '@mui/icons-material/Code';

/**
 * AboutSection 컴포넌트 - 자기소개 + 스킬 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <AboutSection />
 */
function AboutSection() {
  const [animatedSkills, setAnimatedSkills] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // 스킬 데이터
  const skillsData = [
    {
      id: 1,
      icon: 'html',
      name: 'HTML',
      level: 80,
      category: 'Frontend',
      description: '시맨틱 마크업, 접근성 고려한 구조 설계',
      showInHome: true,
    },
    {
      id: 2,
      icon: 'css',
      name: 'CSS',
      level: 75,
      category: 'Frontend',
      description: 'Flexbox, Grid, 반응형 디자인, 애니메이션',
      showInHome: true,
    },
    {
      id: 3,
      icon: 'javascript',
      name: 'JavaScript',
      level: 60,
      category: 'Frontend',
      description: 'ES6+, DOM 조작, 비동기 처리',
      showInHome: true,
    },
    {
      id: 4,
      icon: 'react',
      name: 'React',
      level: 60,
      category: 'Framework',
      description: 'Hooks, 상태관리, 컴포넌트 설계',
      showInHome: true,
    },
    {
      id: 5,
      icon: 'figma',
      name: 'Figma',
      level: 90,
      category: 'Design',
      description: 'UI/UX 디자인, 프로토타이핑, 디자인 시스템',
      showInHome: true,
    },
  ];

  // 카테고리별 색상
  const categoryColors = {
    Frontend: { main: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' },
    Framework: { main: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
    Design: { main: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
    Backend: { main: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
    Tools: { main: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
  };

  // 아이콘 매핑
  const getIcon = (iconName) => {
    const icons = {
      html: <HtmlIcon />,
      css: <CssIcon />,
      javascript: <JavascriptIcon />,
      react: <CodeIcon />,
      figma: <BrushIcon />,
    };
    return icons[iconName] || <CodeIcon />;
  };

  // 스크롤 감지로 애니메이션 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // 순차적 애니메이션
          skillsData.forEach((skill, index) => {
            setTimeout(() => {
              setAnimatedSkills((prev) => ({
                ...prev,
                [skill.id]: skill.level,
              }));
            }, index * 150);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // 숙련도 높은 순으로 정렬 + 홈에 표시할 스킬만 필터링
  const displaySkills = [...skillsData]
    .filter((skill) => skill.showInHome)
    .sort((a, b) => b.level - a.level);

  // 카테고리별 그룹핑
  const categories = [...new Set(displaySkills.map((s) => s.category))];

  return (
    <Box
      component="section"
      ref={sectionRef}
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="overline"
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
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              mb: 2,
              color: 'text.primary',
            }}
          >
            기술 스택
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            웹 디자인과 프론트엔드 개발에 사용하는 기술들입니다
          </Typography>
        </Box>

        {/* 카테고리 필터 칩 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              size="small"
              sx={{
                backgroundColor: categoryColors[category]?.bg || 'rgba(139, 92, 246, 0.15)',
                color: categoryColors[category]?.main || '#8B5CF6',
                fontWeight: 500,
                border: '1px solid',
                borderColor: categoryColors[category]?.main || '#8B5CF6',
              }}
            />
          ))}
        </Box>

        {/* 스킬 그리드 */}
        <Grid container spacing={3}>
          {displaySkills.map((skill) => (
            <Grid key={skill.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Tooltip
                title={skill.description}
                placement="top"
                TransitionComponent={Fade}
                arrow
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      border: '1px solid',
                      borderColor: 'divider',
                      fontSize: '0.85rem',
                      px: 2,
                      py: 1,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      '& .MuiTooltip-arrow': {
                        color: 'background.paper',
                        '&::before': {
                          border: '1px solid',
                          borderColor: 'divider',
                        },
                      },
                    },
                  },
                }}
              >
                <Card
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${categoryColors[skill.category]?.bg || 'rgba(139, 92, 246, 0.2)'}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    {/* 스킬 헤더 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: categoryColors[skill.category]?.bg || 'rgba(139, 92, 246, 0.15)',
                            color: categoryColors[skill.category]?.main || '#8B5CF6',
                          }}
                        >
                          {getIcon(skill.icon)}
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}
                          >
                            {skill.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: categoryColors[skill.category]?.main || 'text.secondary' }}
                          >
                            {skill.category}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: categoryColors[skill.category]?.main || 'primary.main',
                        }}
                      >
                        {animatedSkills[skill.id] || 0}%
                      </Typography>
                    </Box>

                    {/* 프로그래스 바 */}
                    <LinearProgress
                      variant="determinate"
                      value={animatedSkills[skill.id] || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: categoryColors[skill.category]?.main || 'primary.main',
                          transition: 'transform 1s ease-out',
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        {/* 더 알아보기 버튼 */}
        <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 6 } }}>
          <Button
            variant="outlined"
            component={Link}
            to="/about"
            sx={{ px: 4, py: 1 }}
          >
            더 알아보기
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AboutSection;
