import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';
import { supabase } from '../utils/supabase';
import DesignDetailModal from '../components/ui/design-detail-modal';

const CATEGORIES = ['ALL', 'WEB', 'SNS', 'PRINT', 'ETC'];

/**
 * DesignsPage 컴포넌트 - Designs 상세 페이지
 *
 * Props: 없음
 *
 * Example usage:
 * <DesignsPage />
 */
function DesignsPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_designs')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('디자인 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDesigns = useMemo(() => {
    const category = CATEGORIES[activeTab];
    if (category === 'ALL') return designs;
    return designs.filter((d) => (d.category || 'WEB') === category);
  }, [designs, activeTab]);

  const handleCardClick = (design) => {
    setSelectedDesign(design);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDesign(null);
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
            DESIGNS
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 3,
              color: 'text.primary',
            }}
          >
            디자인
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
            다양한 디자인 작업물을 모아놓은 갤러리입니다.
            썸네일을 클릭하면 상세 이미지를 확인할 수 있습니다.
          </Typography>
        </Box>

        {/* 카테고리 탭 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 3, md: 4 } }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{
              '& .MuiTab-root': {
                color: 'text.secondary',
                fontWeight: 600,
                letterSpacing: '0.1em',
                minWidth: { xs: 60, md: 80 },
                '&.Mui-selected': { color: 'primary.main' },
              },
              '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
            }}
          >
            {CATEGORIES.map((cat) => (
              <Tab key={cat} label={cat} />
            ))}
          </Tabs>
        </Box>

        {loading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Grid key={item} size={{ xs: 6, sm: 4, lg: 3 }}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={28} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredDesigns.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              {activeTab === 0 ? '아직 등록된 디자인이 없습니다' : `${CATEGORIES[activeTab]} 카테고리에 등록된 디자인이 없습니다`}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredDesigns.map((design) => (
              <Grid key={design.id} size={{ xs: 6, sm: 4, lg: 3 }}>
                <Card
                  onClick={() => handleCardClick(design)}
                  sx={{
                    cursor: 'pointer',
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
                  <Box sx={{ overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={design.image_url}
                      alt={design.title}
                      sx={{
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.08)',
                        },
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: '0.95rem', md: '1.1rem' },
                        color: 'text.primary',
                        fontWeight: 600,
                      }}
                    >
                      {design.title}
                    </Typography>
                    {design.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mt: 0.5,
                          lineHeight: 1.6,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {design.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <DesignDetailModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        design={selectedDesign}
      />
    </Box>
  );
}

export default DesignsPage;
