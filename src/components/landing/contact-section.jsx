import { useState, useEffect, useCallback, memo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LinkIcon from '@mui/icons-material/Link';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../../utils/supabase';

/**
 * GuestbookEntry 컴포넌트 - 개별 방명록 항목 (메모이제이션)
 */
const GuestbookEntry = memo(function GuestbookEntry({ entry, formatDate }) {
  return (
    <Box
      component="article"
      aria-label={`${entry.author_name}님의 방명록`}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography
          component="h3"
          sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.95rem' }}
        >
          {entry.author_name}
        </Typography>
        {entry.sns_account && (
          <Typography
            component="a"
            href={entry.sns_account.startsWith('http') ? entry.sns_account : `https://instagram.com/${entry.sns_account.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${entry.author_name}님의 SNS 계정`}
            sx={{
              color: 'primary.main',
              fontSize: '0.75rem',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              '&:focus': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              },
            }}
          >
            {entry.sns_account}
          </Typography>
        )}
      </Box>
      {entry.hobby && (
        <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: 1 }}>
          {entry.hobby}
        </Typography>
      )}
      <Typography sx={{ color: 'text.primary', fontSize: '0.875rem', mb: 1, lineHeight: 1.6 }}>
        {entry.message}
      </Typography>
      <Typography
        component="time"
        dateTime={entry.created_at}
        sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
      >
        {formatDate(entry.created_at)}
      </Typography>
    </Box>
  );
});

/**
 * GuestbookForm 컴포넌트 - 방명록 작성 폼 (메모이제이션)
 */
const GuestbookForm = memo(function GuestbookForm({
  formData,
  submitting,
  onInputChange,
  onSubmit,
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{ color: 'text.primary', mb: 3, fontWeight: 600 }}
        >
          메시지 남기기
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate>
          <TextField
            fullWidth
            required
            name="author_name"
            label="이름"
            value={formData.author_name}
            onChange={onInputChange}
            inputProps={{
              'aria-label': '이름 입력',
              'aria-required': 'true',
            }}
            InputProps={{
              startAdornment: <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} aria-hidden="true" />,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            name="message"
            label="메시지"
            multiline
            rows={3}
            value={formData.message}
            onChange={onInputChange}
            inputProps={{
              'aria-label': '메시지 입력',
              'aria-required': 'true',
            }}
            InputProps={{
              startAdornment: <EmailIcon sx={{ color: 'text.secondary', mr: 1, alignSelf: 'flex-start', mt: 1 }} aria-hidden="true" />,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="hobby"
            label="취미/소속 (선택)"
            value={formData.hobby}
            onChange={onInputChange}
            inputProps={{
              'aria-label': '취미 또는 소속 입력 (선택사항)',
            }}
            InputProps={{
              startAdornment: <SportsEsportsIcon sx={{ color: 'text.secondary', mr: 1 }} aria-hidden="true" />,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="sns_account"
            label="SNS 계정 (선택)"
            placeholder="@username 또는 URL"
            value={formData.sns_account}
            onChange={onInputChange}
            inputProps={{
              'aria-label': 'SNS 계정 입력 (선택사항)',
            }}
            InputProps={{
              startAdornment: <LinkIcon sx={{ color: 'text.secondary', mr: 1 }} aria-hidden="true" />,
            }}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting}
            endIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            aria-label={submitting ? '등록 중...' : '방명록 남기기'}
            sx={{
              py: 1.5,
              transition: 'transform 0.2s ease',
              '&:hover:not(:disabled)': {
                transform: 'scale(1.02)',
              },
              '&:focus': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              },
            }}
          >
            {submitting ? '등록 중...' : '남기기'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
});

/**
 * ContactSection 컴포넌트 - 연락처 및 방명록 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <ContactSection />
 */
function ContactSection() {
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    author_name: '',
    message: '',
    hobby: '',
    sns_account: '',
  });

  // 소셜 링크 state
  const [socialLinks, setSocialLinks] = useState([
    { icon: <GitHubIcon />, url: 'https://github.com', label: 'GitHub' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <TwitterIcon />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <InstagramIcon />, url: 'https://instagram.com', label: 'Instagram' },
  ]);

  useEffect(() => {
    fetchGuestbookEntries();
    fetchSocialLinks();
  }, []);

  const getPlatformIcon = useCallback((platform) => {
    const icons = {
      github: <GitHubIcon />,
      linkedin: <LinkedInIcon />,
      twitter: <TwitterIcon />,
      instagram: <InstagramIcon />,
      youtube: <YouTubeIcon />,
      email: <EmailIcon />,
      website: <LanguageIcon />,
    };
    return icons[platform] || <LinkIcon />;
  }, []);

  const getPlatformLabel = useCallback((platform) => {
    const labels = {
      github: 'GitHub',
      linkedin: 'LinkedIn',
      twitter: 'Twitter',
      instagram: 'Instagram',
      youtube: 'YouTube',
      email: 'Email',
      website: 'Website',
    };
    return labels[platform] || platform;
  }, []);

  const fetchSocialLinks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setSocialLinks(data.map((link) => ({
          icon: getPlatformIcon(link.platform),
          url: link.url,
          label: getPlatformLabel(link.platform),
        })));
      }
    } catch (err) {
      console.error('소셜 링크 로딩 실패:', err);
    }
  }, [getPlatformIcon, getPlatformLabel]);

  const fetchGuestbookEntries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_guestbook')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }
      setGuestbookEntries(data || []);
    } catch (err) {
      console.error('방명록 로딩 실패:', err);
      setSnackbar({ open: true, message: '방명록을 불러오는데 실패했습니다.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.author_name.trim() || !formData.message.trim()) {
      setSnackbar({ open: true, message: '이름과 메시지는 필수입니다.', severity: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('portfolio_guestbook')
        .insert([{
          author_name: formData.author_name.trim(),
          message: formData.message.trim(),
          hobby: formData.hobby.trim() || null,
          sns_account: formData.sns_account.trim() || null,
        }]);

      if (error) {
        throw error;
      }

      setSnackbar({ open: true, message: '방명록이 등록되었습니다!', severity: 'success' });
      setFormData({ author_name: '', message: '', hobby: '', sns_account: '' });
      fetchGuestbookEntries();
    } catch (err) {
      console.error('방명록 등록 실패:', err);
      setSnackbar({ open: true, message: '방명록 작성에 실패했습니다.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [formData, fetchGuestbookEntries]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // 로딩 스켈레톤 렌더링
  const renderSkeletons = useCallback(() => (
    <Grid container spacing={2}>
      {[1, 2, 3, 4].map((item) => (
        <Grid size={{ xs: 12, sm: 6 }} key={item}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="20%" height={16} />
            </Box>
            <Skeleton variant="text" width="30%" height={16} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={14} />
          </Box>
        </Grid>
      ))}
    </Grid>
  ), []);

  return (
    <Box
      component="section"
      id="contact"
      aria-labelledby="contact-section-title"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
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
          CONTACT
        </Typography>
        <Typography
          id="contact-section-title"
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            mb: 2,
            color: 'text.primary',
            textAlign: 'center',
            fontWeight: 700,
          }}
        >
          방명록
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            mb: 6,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          방문해 주셔서 감사합니다. 한마디 남겨주세요!
        </Typography>

        {/* 소셜 링크 */}
        <Box
          sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 6 }}
          role="list"
          aria-label="소셜 미디어 링크"
        >
          {socialLinks.map((social) => (
            <IconButton
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.label} 방문하기`}
              role="listitem"
              sx={{
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(196, 181, 253, 0.1)',
                  transform: 'scale(1.1)',
                },
                '&:focus': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>

        <Grid container spacing={4}>
          {/* 방명록 작성 폼 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <GuestbookForm
              formData={formData}
              submitting={submitting}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </Grid>

          {/* 방명록 목록 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ height: '100%', minHeight: 400 }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ color: 'text.primary', mb: 3, fontWeight: 600 }}
                >
                  방명록 목록
                </Typography>
                {loading ? (
                  renderSkeletons()
                ) : guestbookEntries.length === 0 ? (
                  <Typography
                    sx={{ color: 'text.secondary', textAlign: 'center', py: 8 }}
                    role="status"
                  >
                    아직 방명록이 없습니다. 첫 번째 방문자가 되어주세요!
                  </Typography>
                ) : (
                  <Fade in timeout={500}>
                    <Grid container spacing={2} role="list" aria-label="방명록 목록">
                      {guestbookEntries.map((entry) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={entry.id} role="listitem">
                          <GuestbookEntry entry={entry} formatDate={formatDate} />
                        </Grid>
                      ))}
                    </Grid>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          role="alert"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactSection;
