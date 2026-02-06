import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BrushIcon from '@mui/icons-material/Brush';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { supabase } from '../utils/supabase';

/**
 * AboutPage 컴포넌트 - About Me 상세 페이지
 *
 * Props: 없음
 *
 * Example usage:
 * <AboutPage />
 */
function AboutPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [flowerCount, setFlowerCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // About Me 데이터
  const aboutMeData = {
    basicInfo: {
      name: '황지선',
      education: '상일미디어고등학교 졸업',
      major: '디지털만화영상과 출신',
      experience: '2015년부터 활동, 웹디자이너로서 5년 6개월',
      photo: '',
    },
    sections: [
      {
        id: 'dev-story',
        title: 'My Story',
        content: '어릴 적부터 창의적인 생각을 하는 것을 좋아했다. 광고 디자이너가 꿈일 적도 있었다. 지금은 내 머릿속의 이미지를 현실로 그려내는 것이 좋다.',
        showInHome: true,
      },
      {
        id: 'philosophy',
        title: 'My Philosophy',
        content: '자연만이 주는 아름다움을, 인간만이 주는 따스함을 잊지 않는다.',
        showInHome: true,
      },
      {
        id: 'personal',
        title: 'My Favorite',
        content: '디자인만큼 디자인성이 있는 게임이 좋아서 웬종일 전기공사만 하느라 곤란.',
        showInHome: false,
      },
    ],
  };

  // 꽃다발 카운트 불러오기
  useEffect(() => {
    fetchFlowerCount();
  }, []);

  const fetchFlowerCount = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_stats')
        .select('value')
        .eq('key', 'flower_count')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('꽃다발 카운트 로딩 실패:', error);
      }
      if (data) {
        setFlowerCount(data.value);
      }
    } catch (error) {
      console.error('꽃다발 카운트 로딩 실패:', error);
    }
  };

  const handleFlowerClick = async () => {
    setIsAnimating(true);
    const newCount = flowerCount + 1;
    setFlowerCount(newCount);

    try {
      await supabase
        .from('portfolio_stats')
        .upsert({ key: 'flower_count', value: newCount }, { onConflict: 'key' });
    } catch (error) {
      console.error('꽃다발 카운트 저장 실패:', error);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 탭에 표시할 섹션 그룹화
  const tabSections = [
    { label: 'My Story', sections: aboutMeData.sections.filter((s) => s.title === 'My Story') },
    { label: 'My Philosophy', sections: aboutMeData.sections.filter((s) => s.title === 'My Philosophy') },
    { label: 'My Favorite', sections: aboutMeData.sections.filter((s) => s.title === 'My Favorite') },
  ];

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        py: { xs: 10, md: 12 },
      }}
    >
      <Container maxWidth="md">
        {/* 헤더 */}
        <Typography
          variant="overline"
          sx={{
            color: 'primary.main',
            letterSpacing: '0.2em',
            mb: 2,
            display: 'block',
            textAlign: 'center',
          }}
        >
          ABOUT ME
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            mb: { xs: 4, md: 6 },
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          About Me
        </Typography>

        {/* 기본 정보 카드 */}
        <Card
          sx={{
            mb: 4,
            background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              {/* 프로필 사진 */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    sx={{
                      width: { xs: 120, md: 160 },
                      height: { xs: 120, md: 160 },
                      bgcolor: 'primary.main',
                      fontSize: { xs: '3rem', md: '4rem' },
                      border: '3px solid',
                      borderColor: 'primary.light',
                    }}
                  >
                    {aboutMeData.basicInfo.name.charAt(0)}
                  </Avatar>
                </Box>
              </Grid>

              {/* 기본 정보 */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    mb: 2,
                    color: 'text.primary',
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  {aboutMeData.basicInfo.name}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {aboutMeData.basicInfo.education}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BrushIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {aboutMeData.basicInfo.major}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {aboutMeData.basicInfo.experience}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 콘텐츠 섹션 탭 */}
        <Card
          sx={{
            mb: 4,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                },
              }}
            >
              {tabSections.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </Tabs>
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {tabSections[activeTab].sections.map((section, index) => (
              <Box
                key={section.id}
                sx={{
                  mb: index < tabSections[activeTab].sections.length - 1 ? 3 : 0,
                  pb: index < tabSections[activeTab].sections.length - 1 ? 3 : 0,
                  borderBottom: index < tabSections[activeTab].sections.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                {section.showInHome && (
                  <Chip
                    label="홈에 표시"
                    size="small"
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(196, 181, 253, 0.2)',
                      color: 'primary.main',
                      fontSize: '0.7rem',
                    }}
                  />
                )}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.8,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                  }}
                >
                  {section.content}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* 꽃다발 버튼 섹션 */}
        <Card
          sx={{
            textAlign: 'center',
            py: 4,
            background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.08) 0%, rgba(167, 139, 250, 0.04) 100%)',
          }}
        >
          <CardContent>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mb: 2 }}
            >
              이 페이지가 마음에 드셨나요?
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <Tooltip
                title="온기를 나누어 주세요!"
                placement="top"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 300 }}
                arrow
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontSize: '0.85rem',
                      px: 2,
                      py: 1,
                      '& .MuiTooltip-arrow': {
                        color: 'primary.main',
                      },
                    },
                  },
                }}
              >
                <IconButton
                  onClick={handleFlowerClick}
                  sx={{
                    width: 64,
                    height: 64,
                    backgroundColor: 'rgba(196, 181, 253, 0.15)',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    transition: 'all 0.3s ease',
                    transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
                    '&:hover': {
                      backgroundColor: 'rgba(196, 181, 253, 0.3)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <LocalFloristIcon
                    sx={{
                      fontSize: 32,
                      color: 'primary.main',
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                  }}
                >
                  {flowerCount.toLocaleString()}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary' }}
                >
                  송이의 꽃다발
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AboutPage;
