import { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import JavascriptIcon from '@mui/icons-material/Javascript';
import BrushIcon from '@mui/icons-material/Brush';
import CodeIcon from '@mui/icons-material/Code';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DrawIcon from '@mui/icons-material/Draw';
import TableChartIcon from '@mui/icons-material/TableChart';
import { skillsData, categoryColors, getHomeSkills, getCategories } from '../../data/portfolio-data';

/**
 * SkillCard 컴포넌트 - 개별 스킬 카드 (메모이제이션)
 */
const SkillCard = memo(function SkillCard({ skill, animatedLevel, categoryColor, getIcon }) {
  return (
    <Tooltip
      title={skill.description}
      placement="top"
      TransitionComponent={Fade}
      arrow
      enterDelay={200}
      leaveDelay={100}
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
        tabIndex={0}
        role="article"
        aria-label={`${skill.name} 스킬, 숙련도 ${skill.level}%`}
        sx={{
          p: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${categoryColor?.bg || 'rgba(139, 92, 246, 0.2)'}`,
          },
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
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
                  backgroundColor: categoryColor?.bg || 'rgba(139, 92, 246, 0.15)',
                  color: categoryColor?.main || '#8B5CF6',
                  transition: 'transform 0.2s ease',
                }}
                aria-hidden="true"
              >
                {getIcon(skill.icon)}
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  component="h3"
                  sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}
                >
                  {skill.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: categoryColor?.main || 'text.secondary' }}
                >
                  {skill.category}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="h6"
              component="span"
              aria-live="polite"
              sx={{
                fontWeight: 700,
                color: categoryColor?.main || 'primary.main',
                transition: 'transform 0.3s ease',
              }}
            >
              {animatedLevel}%
            </Typography>
          </Box>

          {/* 프로그래스 바 */}
          <LinearProgress
            variant="determinate"
            value={animatedLevel}
            aria-label={`${skill.name} 숙련도 ${animatedLevel}%`}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: categoryColor?.main || 'primary.main',
                transition: 'transform 1s ease-out',
              },
            }}
          />
        </CardContent>
      </Card>
    </Tooltip>
  );
});

/**
 * SkillTreeSection 컴포넌트 - 기술 스택 시각화 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <SkillTreeSection />
 */
const SkillTreeSection = memo(function SkillTreeSection() {
  const [animatedSkills, setAnimatedSkills] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);

  // useMemo로 데이터 캐싱
  const displaySkills = useMemo(() => getHomeSkills(), []);
  const categories = useMemo(() => getCategories(), []);

  // useCallback으로 아이콘 함수 메모이제이션
  const getIcon = useCallback((iconName) => {
    const icons = {
      html: <HtmlIcon />,
      css: <CssIcon />,
      javascript: <JavascriptIcon />,
      react: <CodeIcon />,
      figma: <BrushIcon />,
      photoshop: <PhotoCameraIcon />,
      illustration: <DrawIcon />,
      excel: <TableChartIcon />,
    };
    return icons[iconName] || <CodeIcon />;
  }, []);

  // 스크롤 감지로 애니메이션 트리거
  useEffect(() => {
    // 초기 로딩 시뮬레이션
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // 순차적 애니메이션
          displaySkills.forEach((skill, index) => {
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

    return () => {
      clearTimeout(loadTimer);
      observer.disconnect();
    };
  }, [isVisible, displaySkills]);

  // 키보드 네비게이션 핸들러
  const handleKeyDown = useCallback((e, index) => {
    const cards = document.querySelectorAll('[role="article"]');
    let nextIndex = index;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (index + 1) % cards.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (index - 1 + cards.length) % cards.length;
        break;
      default:
        return;
    }

    cards[nextIndex]?.focus();
  }, []);

  // 로딩 스켈레톤 렌더링
  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ p: 2 }}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Skeleton variant="rounded" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
                <Skeleton variant="text" width={40} height={28} />
              </Box>
              <Skeleton variant="rounded" height={8} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box
      component="section"
      ref={sectionRef}
      aria-labelledby="skills-section-title"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
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
            SKILLS
          </Typography>
          <Typography
            id="skills-section-title"
            variant="h2"
            component="h2"
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
        <Box
          sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4, flexWrap: 'wrap' }}
          role="list"
          aria-label="스킬 카테고리 목록"
        >
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              size="small"
              role="listitem"
              sx={{
                backgroundColor: categoryColors[category]?.bg || 'rgba(139, 92, 246, 0.15)',
                color: categoryColors[category]?.main || '#8B5CF6',
                fontWeight: 500,
                border: '1px solid',
                borderColor: categoryColors[category]?.main || '#8B5CF6',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          ))}
        </Box>

        {/* 스킬 그리드 */}
        {isLoading ? (
          renderSkeletons()
        ) : (
          <Fade in={!isLoading} timeout={500}>
            <Grid container spacing={3} role="list" aria-label="스킬 목록">
              {displaySkills.map((skill, index) => (
                <Grid
                  key={skill.id}
                  size={{ xs: 12, sm: 6, md: 4 }}
                  role="listitem"
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  <SkillCard
                    skill={skill}
                    animatedLevel={animatedSkills[skill.id] || 0}
                    categoryColor={categoryColors[skill.category]}
                    getIcon={getIcon}
                  />
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
      </Container>
    </Box>
  );
});

export default SkillTreeSection;
