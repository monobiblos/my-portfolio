import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BrushIcon from '@mui/icons-material/Brush';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { supabase } from '../utils/supabase';
import { aboutMeData } from '../data/portfolio-data';

/**
 * TabPanel 컴포넌트 - 탭 콘텐츠 패널 (메모이제이션)
 */
const TabPanel = memo(function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`about-tabpanel-${index}`}
      aria-labelledby={`about-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in timeout={300}>
          <Box>{children}</Box>
        </Fade>
      )}
    </div>
  );
});

/**
 * BasicInfoCard 컴포넌트 - 기본 정보 카드 (메모이제이션)
 */
const BasicInfoCard = memo(function BasicInfoCard({ basicInfo }) {
  return (
    <Card
      sx={{
        mb: 4,
        background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(196, 181, 253, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Grid container spacing={3} alignItems="center">
          {/* 프로필 사진 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                alt={basicInfo.name}
                sx={{
                  width: { xs: 120, md: 160 },
                  height: { xs: 120, md: 160 },
                  bgcolor: 'primary.main',
                  fontSize: { xs: '3rem', md: '4rem' },
                  border: '3px solid',
                  borderColor: 'primary.light',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {basicInfo.name.charAt(0)}
              </Avatar>
            </Box>
          </Grid>

          {/* 기본 정보 */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                mb: 2,
                color: 'text.primary',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              {basicInfo.name}
            </Typography>

            <Box
              component="dl"
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, m: 0 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon sx={{ color: 'primary.main', fontSize: 20 }} aria-hidden="true" />
                <Typography component="dd" variant="body1" sx={{ color: 'text.secondary', m: 0 }}>
                  {basicInfo.education}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BrushIcon sx={{ color: 'primary.main', fontSize: 20 }} aria-hidden="true" />
                <Typography component="dd" variant="body1" sx={{ color: 'text.secondary', m: 0 }}>
                  {basicInfo.major}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon sx={{ color: 'primary.main', fontSize: 20 }} aria-hidden="true" />
                <Typography component="dd" variant="body1" sx={{ color: 'text.secondary', m: 0 }}>
                  {basicInfo.experience}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

/**
 * FlowerButton 컴포넌트 - 응원하기 버튼 (메모이제이션)
 */
const FlowerButton = memo(function FlowerButton({
  flowerCount,
  isAnimating,
  isLoading,
  error,
  onFlowerClick,
}) {
  return (
    <Card
      sx={{
        textAlign: 'center',
        py: 4,
        background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.08) 0%, rgba(167, 139, 250, 0.04) 100%)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(196, 181, 253, 0.1)',
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="h2"
          sx={{ color: 'text.primary', mb: 3, fontWeight: 600 }}
        >
          응원하기
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, maxWidth: 300, mx: 'auto' }}>
            {error}
          </Alert>
        )}

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
              onClick={onFlowerClick}
              disabled={isLoading}
              aria-label={`응원하기 버튼, 현재 ${flowerCount}송이`}
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
                '&:focus': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '4px',
                },
                '&:disabled': {
                  opacity: 0.7,
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'primary.main' }} />
              ) : (
                <LocalFloristIcon
                  sx={{
                    fontSize: 32,
                    color: 'primary.main',
                  }}
                />
              )}
            </IconButton>
          </Tooltip>

          <Box sx={{ textAlign: 'left' }}>
            {isLoading && flowerCount === 0 ? (
              <>
                <Skeleton variant="text" width={60} height={36} />
                <Skeleton variant="text" width={80} height={20} />
              </>
            ) : (
              <>
                <Typography
                  variant="h4"
                  component="p"
                  aria-live="polite"
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
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // useMemo로 탭 섹션 캐싱
  const tabSections = useMemo(() => [
    { label: 'My Story', sections: aboutMeData.sections.filter((s) => s.title === 'My Story') },
    { label: 'My Philosophy', sections: aboutMeData.sections.filter((s) => s.title === 'My Philosophy') },
    { label: 'My Favorite', sections: aboutMeData.sections.filter((s) => s.title === 'My Favorite') },
  ], []);

  // 꽃다발 카운트 불러오기
  useEffect(() => {
    fetchFlowerCount();
  }, []);

  const fetchFlowerCount = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('portfolio_stats')
        .select('value')
        .eq('key', 'flower_count')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      if (data) {
        setFlowerCount(data.value);
      }
    } catch (err) {
      console.error('꽃다발 카운트 로딩 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFlowerClick = useCallback(async () => {
    if (isSaving) return;

    setIsAnimating(true);
    setIsSaving(true);
    setError(null);

    const newCount = flowerCount + 1;
    setFlowerCount(newCount);

    try {
      const { error: saveError } = await supabase
        .from('portfolio_stats')
        .upsert({ key: 'flower_count', value: newCount }, { onConflict: 'key' });

      if (saveError) {
        throw saveError;
      }
    } catch (err) {
      console.error('꽃다발 카운트 저장 실패:', err);
      setFlowerCount((prev) => prev - 1);
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [flowerCount, isSaving]);

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  // 접근성을 위한 탭 속성
  const a11yProps = useCallback((index) => ({
    id: `about-tab-${index}`,
    'aria-controls': `about-tabpanel-${index}`,
  }), []);

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
          component="span"
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
          자기소개
        </Typography>

        {/* 기본 정보 카드 */}
        <BasicInfoCard basicInfo={aboutMeData.basicInfo} />

        {/* 콘텐츠 섹션 탭 */}
        <Card sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="자기소개 섹션 탭"
              sx={{
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  transition: 'color 0.3s ease',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                  '&:focus': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '-2px',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              {tabSections.map((tab, index) => (
                <Tab key={index} label={tab.label} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {tabSections.map((tab, tabIndex) => (
              <TabPanel key={tabIndex} value={activeTab} index={tabIndex}>
                {tab.sections.map((section, sectionIndex) => (
                  <Box
                    key={section.id}
                    sx={{
                      mb: sectionIndex < tab.sections.length - 1 ? 3 : 0,
                      pb: sectionIndex < tab.sections.length - 1 ? 3 : 0,
                      borderBottom: sectionIndex < tab.sections.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
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
              </TabPanel>
            ))}
          </CardContent>
        </Card>

        {/* 꽃다발 버튼 섹션 */}
        <FlowerButton
          flowerCount={flowerCount}
          isAnimating={isAnimating}
          isLoading={isLoading}
          error={error}
          onFlowerClick={handleFlowerClick}
        />
      </Container>
    </Box>
  );
}

export default AboutPage;
