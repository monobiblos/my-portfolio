import { useState, useEffect } from 'react';
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
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LinkIcon from '@mui/icons-material/Link';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../../utils/supabase';

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

  useEffect(() => {
    fetchGuestbookEntries();
  }, []);

  const fetchGuestbookEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_guestbook')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      setSnackbar({ open: true, message: '방명록을 불러오는데 실패했습니다.', severity: 'error' });
    } else {
      setGuestbookEntries(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.author_name.trim() || !formData.message.trim()) {
      setSnackbar({ open: true, message: '이름과 메시지는 필수입니다.', severity: 'warning' });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from('portfolio_guestbook')
      .insert([{
        author_name: formData.author_name.trim(),
        message: formData.message.trim(),
        hobby: formData.hobby.trim() || null,
        sns_account: formData.sns_account.trim() || null,
      }]);

    if (error) {
      setSnackbar({ open: true, message: '방명록 작성에 실패했습니다.', severity: 'error' });
    } else {
      setSnackbar({ open: true, message: '방명록이 등록되었습니다!', severity: 'success' });
      setFormData({ author_name: '', message: '', hobby: '', sns_account: '' });
      fetchGuestbookEntries();
    }
    setSubmitting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const socialLinks = [
    { icon: <GitHubIcon />, url: 'https://github.com', label: 'GitHub' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <TwitterIcon />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <InstagramIcon />, url: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
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
          CONTACT
        </Typography>
        <Typography
          variant="h2"
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

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 6 }}>
          {socialLinks.map((social) => (
            <IconButton
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              sx={{
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                },
              }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                height: '100%',
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{ color: 'text.primary', mb: 3, fontWeight: 600 }}
                >
                  메시지 남기기
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    required
                    name="author_name"
                    label="이름"
                    value={formData.author_name}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />,
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
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ color: 'text.secondary', mr: 1, alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    name="hobby"
                    label="취미/소속 (선택)"
                    value={formData.hobby}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <SportsEsportsIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    name="sns_account"
                    label="SNS 계정 (선택)"
                    placeholder="@username 또는 URL"
                    value={formData.sns_account}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <LinkIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={submitting}
                    endIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{
                      py: 1.5,
                    }}
                  >
                    {submitting ? '등록 중...' : '남기기'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              sx={{
                height: '100%',
                minHeight: 400,
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{ color: 'text.primary', mb: 3, fontWeight: 600 }}
                >
                  방명록 목록
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: 'primary.main' }} />
                  </Box>
                ) : guestbookEntries.length === 0 ? (
                  <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 8 }}>
                    아직 방명록이 없습니다. 첫 번째 방문자가 되어주세요!
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {guestbookEntries.map((entry) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={entry.id}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'background.default',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.95rem' }}>
                              {entry.author_name}
                            </Typography>
                            {entry.sns_account && (
                              <Typography
                                component="a"
                                href={entry.sns_account.startsWith('http') ? entry.sns_account : `https://instagram.com/${entry.sns_account.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: 'primary.main',
                                  fontSize: '0.75rem',
                                  textDecoration: 'none',
                                  '&:hover': { textDecoration: 'underline' },
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
                          <Typography sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            {formatDate(entry.created_at)}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactSection;
