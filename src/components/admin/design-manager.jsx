import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
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
import { supabase } from '../../utils/supabase';
import ImageUpload from './image-upload';

const emptyDesign = {
  title: '',
  description: '',
  image_url: '',
  is_published: true,
  sort_order: 0,
};

function DesignManager() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [formData, setFormData] = useState(emptyDesign);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchDesigns = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_designs')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setDesigns(data || []);
    } catch (err) {
      console.error('디자인 로딩 실패:', err);
      setSnackbar({ open: true, message: '디자인 로딩에 실패했습니다.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleOpenAdd = useCallback(() => {
    setEditingDesign(null);
    setFormData(emptyDesign);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((design) => {
    setEditingDesign(design);
    setFormData({
      title: design.title || '',
      description: design.description || '',
      image_url: design.image_url || '',
      is_published: design.is_published ?? true,
      sort_order: design.sort_order ?? 0,
    });
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.title.trim()) {
      setSnackbar({ open: true, message: '디자인 제목은 필수입니다.', severity: 'warning' });
      return;
    }

    setSubmitting(true);
    const designData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      image_url: formData.image_url.trim() || null,
      is_published: formData.is_published,
      sort_order: Number(formData.sort_order) || 0,
    };

    try {
      if (editingDesign) {
        const { error } = await supabase
          .from('portfolio_designs')
          .update(designData)
          .eq('id', editingDesign.id);
        if (error) throw error;
        setSnackbar({ open: true, message: '디자인이 수정되었습니다.', severity: 'success' });
      } else {
        const { error } = await supabase
          .from('portfolio_designs')
          .insert([designData]);
        if (error) throw error;
        setSnackbar({ open: true, message: '디자인이 추가되었습니다.', severity: 'success' });
      }
      setDialogOpen(false);
      fetchDesigns();
    } catch (err) {
      console.error('디자인 저장 실패:', err);
      setSnackbar({ open: true, message: '저장에 실패했습니다.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [formData, editingDesign, fetchDesigns]);

  const handleDelete = useCallback(async () => {
    if (!editingDesign) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('portfolio_designs')
        .delete()
        .eq('id', editingDesign.id);
      if (error) throw error;
      setSnackbar({ open: true, message: '디자인이 삭제되었습니다.', severity: 'success' });
      setDeleteDialogOpen(false);
      setEditingDesign(null);
      fetchDesigns();
    } catch (err) {
      console.error('디자인 삭제 실패:', err);
      setSnackbar({ open: true, message: '삭제에 실패했습니다.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [editingDesign, fetchDesigns]);

  const handleTogglePublish = useCallback(async (design) => {
    try {
      const { error } = await supabase
        .from('portfolio_designs')
        .update({ is_published: !design.is_published })
        .eq('id', design.id);
      if (error) throw error;
      fetchDesigns();
    } catch (err) {
      console.error('공개 상태 변경 실패:', err);
      setSnackbar({ open: true, message: '상태 변경에 실패했습니다.', severity: 'error' });
    }
  }, [fetchDesigns]);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid key={item} size={{ xs: 12, md: 6 }}>
            <Card><Skeleton variant="rectangular" height={160} /><CardContent><Skeleton variant="text" width="60%" /><Skeleton variant="text" width="80%" /></CardContent></Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          디자인 ({designs.length}개)
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          추가
        </Button>
      </Box>

      {designs.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: 'text.secondary' }}>등록된 디자인이 없습니다.</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {designs.map((design) => (
            <Grid key={design.id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ opacity: design.is_published ? 1 : 0.6 }}>
                {design.image_url && (
                  <CardMedia component="img" height="160" image={design.image_url} alt={design.title} />
                )}
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        {design.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {design.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                      <IconButton size="small" onClick={() => handleOpenEdit(design)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => { setEditingDesign(design); setDeleteDialogOpen(true); }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      순서: {design.sort_order}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: design.is_published ? 'success.main' : 'text.secondary' }}>
                        {design.is_published ? '공개' : '비공개'}
                      </Typography>
                      <Switch size="small" checked={design.is_published} onChange={() => handleTogglePublish(design)} />
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
        <DialogTitle>{editingDesign ? '디자인 수정' : '디자인 추가'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField fullWidth required name="title" label="디자인 제목" value={formData.title} onChange={handleInputChange} />
          <TextField fullWidth name="description" label="설명" multiline rows={3} value={formData.description} onChange={handleInputChange} />
          <ImageUpload value={formData.image_url} onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url || '' }))} folder="designs" label="디자인 이미지" />
          <TextField fullWidth name="sort_order" label="정렬 순서" type="number" value={formData.sort_order} onChange={handleInputChange} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch checked={formData.is_published} onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))} />
            <Typography variant="body2">{formData.is_published ? '공개' : '비공개'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '저장 중...' : editingDesign ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>디자인 삭제</DialogTitle>
        <DialogContent>
          <Typography>"{editingDesign?.title}" 디자인을 삭제하시겠습니까?</Typography>
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

export default DesignManager;
