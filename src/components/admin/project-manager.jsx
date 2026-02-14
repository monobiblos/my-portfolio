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
import Chip from '@mui/material/Chip';
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
import FileUpload from './file-upload';

const emptyProject = {
  title: '',
  description: '',
  thumbnail_url: '',
  detail_url: '',
  doc_url: '',
  tech_stack: '',
  is_published: true,
  sort_order: 0,
};

function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(emptyProject);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('프로젝트 로딩 실패:', err);
      setSnackbar({ open: true, message: '프로젝트 로딩에 실패했습니다.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleOpenAdd = useCallback(() => {
    setEditingProject(null);
    setFormData(emptyProject);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      thumbnail_url: project.thumbnail_url || '',
      detail_url: project.detail_url || '',
      doc_url: project.doc_url || '',
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '',
      is_published: project.is_published ?? true,
      sort_order: project.sort_order ?? 0,
    });
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.title.trim()) {
      setSnackbar({ open: true, message: '프로젝트 제목은 필수입니다.', severity: 'warning' });
      return;
    }

    setSubmitting(true);
    const projectData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      thumbnail_url: formData.thumbnail_url.trim() || null,
      detail_url: formData.detail_url.trim() || null,
      doc_url: formData.doc_url.trim() || null,
      tech_stack: formData.tech_stack
        ? formData.tech_stack.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      is_published: formData.is_published,
      sort_order: Number(formData.sort_order) || 0,
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('portfolio_projects')
          .update(projectData)
          .eq('id', editingProject.id);
        if (error) throw error;
        setSnackbar({ open: true, message: '프로젝트가 수정되었습니다.', severity: 'success' });
      } else {
        const { error } = await supabase
          .from('portfolio_projects')
          .insert([projectData]);
        if (error) throw error;
        setSnackbar({ open: true, message: '프로젝트가 추가되었습니다.', severity: 'success' });
      }
      setDialogOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('프로젝트 저장 실패:', err);
      setSnackbar({ open: true, message: '저장에 실패했습니다.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [formData, editingProject, fetchProjects]);

  const handleDelete = useCallback(async () => {
    if (!editingProject) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', editingProject.id);
      if (error) throw error;
      setSnackbar({ open: true, message: '프로젝트가 삭제되었습니다.', severity: 'success' });
      setDeleteDialogOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error('프로젝트 삭제 실패:', err);
      setSnackbar({ open: true, message: '삭제에 실패했습니다.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [editingProject, fetchProjects]);

  const handleTogglePublish = useCallback(async (project) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ is_published: !project.is_published })
        .eq('id', project.id);
      if (error) throw error;
      fetchProjects();
    } catch (err) {
      console.error('공개 상태 변경 실패:', err);
      setSnackbar({ open: true, message: '상태 변경에 실패했습니다.', severity: 'error' });
    }
  }, [fetchProjects]);

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
          프로젝트 ({projects.length}개)
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          추가
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: 'text.secondary' }}>등록된 프로젝트가 없습니다.</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ opacity: project.is_published ? 1 : 0.6 }}>
                {project.thumbnail_url && (
                  <CardMedia component="img" height="160" image={project.thumbnail_url} alt={project.title} />
                )}
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {project.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                      <IconButton size="small" onClick={() => handleOpenEdit(project)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => { setEditingProject(project); setDeleteDialogOpen(true); }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                    {project.tech_stack?.map((tech) => (
                      <Chip key={tech} label={tech} size="small" sx={{ fontSize: '0.7rem', height: 22 }} />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      순서: {project.sort_order}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: project.is_published ? 'success.main' : 'text.secondary' }}>
                        {project.is_published ? '공개' : '비공개'}
                      </Typography>
                      <Switch size="small" checked={project.is_published} onChange={() => handleTogglePublish(project)} />
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
        <DialogTitle>{editingProject ? '프로젝트 수정' : '프로젝트 추가'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField fullWidth required name="title" label="프로젝트 제목" value={formData.title} onChange={handleInputChange} />
          <TextField fullWidth name="description" label="설명" multiline rows={3} value={formData.description} onChange={handleInputChange} />
          <ImageUpload value={formData.thumbnail_url} onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail_url: url || '' }))} folder="projects" label="썸네일" />
          <TextField fullWidth name="detail_url" label="프로젝트 URL" value={formData.detail_url} onChange={handleInputChange} />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mt: 1 }}>
            프로젝트 설계서 (링크 또는 파일 업로드)
          </Typography>
          <TextField fullWidth name="doc_url" label="설계서 URL (직접 입력)" placeholder="https://docs.google.com/..." value={formData.doc_url} onChange={handleInputChange} />
          <FileUpload value={formData.doc_url} onChange={(url) => setFormData((prev) => ({ ...prev, doc_url: url || '' }))} folder="documents" label="또는 파일 업로드" />
          <TextField fullWidth name="tech_stack" label="기술 스택 (쉼표로 구분)" placeholder="React, Vite, MUI" value={formData.tech_stack} onChange={handleInputChange} />
          <TextField fullWidth name="sort_order" label="정렬 순서" type="number" value={formData.sort_order} onChange={handleInputChange} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch checked={formData.is_published} onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))} />
            <Typography variant="body2">{formData.is_published ? '공개' : '비공개'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '저장 중...' : editingProject ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>프로젝트 삭제</DialogTitle>
        <DialogContent>
          <Typography>"{editingProject?.title}" 프로젝트를 삭제하시겠습니까?</Typography>
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

export default ProjectManager;
