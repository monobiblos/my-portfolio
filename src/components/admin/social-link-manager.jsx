import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LinkIcon from '@mui/icons-material/Link';
import { supabase } from '../../utils/supabase';

const PLATFORM_OPTIONS = [
  { value: 'github', label: 'GitHub', icon: <GitHubIcon /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon /> },
  { value: 'twitter', label: 'Twitter / X', icon: <TwitterIcon /> },
  { value: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
  { value: 'youtube', label: 'YouTube', icon: <YouTubeIcon /> },
  { value: 'email', label: 'Email', icon: <EmailIcon /> },
  { value: 'website', label: 'Website', icon: <LanguageIcon /> },
  { value: 'other', label: '기타', icon: <LinkIcon /> },
];

function getPlatformIcon(platform) {
  const found = PLATFORM_OPTIONS.find((p) => p.value === platform);
  return found ? found.icon : <LinkIcon />;
}

function getPlatformLabel(platform) {
  const found = PLATFORM_OPTIONS.find((p) => p.value === platform);
  return found ? found.label : platform;
}

const emptyLink = {
  platform: 'github',
  url: '',
  is_active: true,
  sort_order: 0,
};

function SocialLinkManager() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState(emptyLink);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (err) {
      console.error('소셜 링크 로딩 실패:', err);
      setSnackbar({ open: true, message: '소셜 링크 로딩에 실패했습니다.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleOpenAdd = useCallback(() => {
    setEditingLink(null);
    setFormData(emptyLink);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((link) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform || 'github',
      url: link.url || '',
      is_active: link.is_active ?? true,
      sort_order: link.sort_order ?? 0,
    });
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.url.trim()) {
      setSnackbar({ open: true, message: 'URL은 필수입니다.', severity: 'warning' });
      return;
    }

    setSubmitting(true);
    const linkData = {
      platform: formData.platform,
      url: formData.url.trim(),
      is_active: formData.is_active,
      sort_order: Number(formData.sort_order) || 0,
    };

    try {
      if (editingLink) {
        const { error } = await supabase
          .from('social_links')
          .update(linkData)
          .eq('id', editingLink.id);
        if (error) throw error;
        setSnackbar({ open: true, message: '소셜 링크가 수정되었습니다.', severity: 'success' });
      } else {
        const { error } = await supabase
          .from('social_links')
          .insert([linkData]);
        if (error) throw error;
        setSnackbar({ open: true, message: '소셜 링크가 추가되었습니다.', severity: 'success' });
      }
      setDialogOpen(false);
      fetchLinks();
    } catch (err) {
      console.error('소셜 링크 저장 실패:', err);
      setSnackbar({ open: true, message: '저장에 실패했습니다.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [formData, editingLink, fetchLinks]);

  const handleDelete = useCallback(async () => {
    if (!editingLink) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', editingLink.id);
      if (error) throw error;
      setSnackbar({ open: true, message: '소셜 링크가 삭제되었습니다.', severity: 'success' });
      setDeleteDialogOpen(false);
      setEditingLink(null);
      fetchLinks();
    } catch (err) {
      console.error('소셜 링크 삭제 실패:', err);
      setSnackbar({ open: true, message: '삭제에 실패했습니다.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [editingLink, fetchLinks]);

  const handleToggleActive = useCallback(async (link) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .update({ is_active: !link.is_active })
        .eq('id', link.id);
      if (error) throw error;
      fetchLinks();
    } catch (err) {
      console.error('활성 상태 변경 실패:', err);
      setSnackbar({ open: true, message: '상태 변경에 실패했습니다.', severity: 'error' });
    }
  }, [fetchLinks]);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid key={item} size={{ xs: 12, md: 6 }}>
            <Card><CardContent><Skeleton variant="text" width="60%" /><Skeleton variant="text" width="80%" /></CardContent></Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          소셜 링크 ({links.length}개)
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          추가
        </Button>
      </Box>

      {links.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: 'text.secondary' }}>등록된 소셜 링크가 없습니다.</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {links.map((link) => (
            <Grid key={link.id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ opacity: link.is_active ? 1 : 0.6 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                      <Box sx={{ color: 'primary.main', display: 'flex' }}>
                        {getPlatformIcon(link.platform)}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                          {getPlatformLabel(link.platform)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {link.url}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                      <IconButton size="small" onClick={() => handleOpenEdit(link)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => { setEditingLink(link); setDeleteDialogOpen(true); }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      순서: {link.sort_order}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: link.is_active ? 'success.main' : 'text.secondary' }}>
                        {link.is_active ? '활성' : '비활성'}
                      </Typography>
                      <Switch size="small" checked={link.is_active} onChange={() => handleToggleActive(link)} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingLink ? '소셜 링크 수정' : '소셜 링크 추가'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <FormControl fullWidth>
            <InputLabel>플랫폼</InputLabel>
            <Select name="platform" value={formData.platform} label="플랫폼" onChange={handleInputChange}>
              {PLATFORM_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {opt.icon}
                    {opt.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField fullWidth required name="url" label="URL" placeholder="https://github.com/username" value={formData.url} onChange={handleInputChange} />
          <TextField fullWidth name="sort_order" label="정렬 순서" type="number" value={formData.sort_order} onChange={handleInputChange} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch checked={formData.is_active} onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))} />
            <Typography variant="body2">{formData.is_active ? '활성' : '비활성'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '저장 중...' : editingLink ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>소셜 링크 삭제</DialogTitle>
        <DialogContent>
          <Typography>"{editingLink ? getPlatformLabel(editingLink.platform) : ''}" 링크를 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={submitting}>
            {submitting ? '삭제 중...' : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SocialLinkManager;
