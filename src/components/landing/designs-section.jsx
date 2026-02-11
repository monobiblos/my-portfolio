import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import DesignDetailModal from '../ui/design-detail-modal';

/**
 * DesignsSection 컴포넌트 - 디자인 갤러리 미리보기 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <DesignsSection />
 */
function DesignsSection() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_designs')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .limit(4);

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('디자인 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

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
      component="section"
      id="designs"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.default',
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
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              mb: 2,
              color: 'text.primary',
            }}
          >
            디자인
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            작업한 디자인 포트폴리오입니다
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid key={item} size={{ xs: 6, sm: 6, md: 3 }}>
                <Card>
                  <Skeleton variant="rectangular" height={180} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {designs.map((design) => (
              <Grid key={design.id} size={{ xs: 6, sm: 6, md: 3 }}>
                <Card
                  onClick={() => handleCardClick(design)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 8px 30px rgba(196, 181, 253, 0.3)',
                    },
                  }}
                >
                  <Box sx={{ overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={design.image_url}
                      alt={design.title}
                      sx={{
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: 'text.primary',
                      }}
                    >
                      {design.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 6 } }}>
          <Button
            variant="outlined"
            component={Link}
            to="/designs"
            sx={{ px: 4, py: 1 }}
          >
            더 보기
          </Button>
        </Box>
      </Container>

      <DesignDetailModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        design={selectedDesign}
      />
    </Box>
  );
}

export default DesignsSection;
