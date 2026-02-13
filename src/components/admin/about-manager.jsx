import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
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
import SaveIcon from '@mui/icons-material/Save';
import { supabase } from '../../utils/supabase';
import ImageUpload from './image-upload';
import FileUpload from './file-upload';

const emptyBasicInfo = {
  name: '',
  education: '',
  major: '',
  experience: '',
  photo: '',
  resume_url: '',
  portfolio_url: '',
};

const emptySection = {
  title: '',
  content: '',
  show_in_home: false,
  sort_order: 0,
};

function AboutManager() {
  // 기본 정보 state
  const [basicInfo, setBasicInfo] = useState(emptyBasicInfo);
  const [basicInfoLoading, setBasicInfoLoading] = useState(true);
  const [basicInfoSaving, setBasicInfoSaving] = useState(false);

  // 섹션 state
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState(emptySection);
  const [submitting, setSubmitting] = useState(false);

  // 공유 state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // === 기본 정보 함수 ===
  const fetchBasicInfo = useCallback(async () => {
    setBasicInfoLoading(true);
    try {
      const { data, error } = await supabase
        .from('about_basic_info')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setBasicInfo({
          name: data.name || '',
          education: data.education || '',
          major: data.major || '',
          experience: data.experience || '',
          photo: data.photo || '',
        });
      }
    } catch (err) {
      console.error('기본 정보 로딩 실패:', err);
      setSnackbar({ open: true, message: '기본 정보 로딩에 실패했습니다.', severity: 'error' });
    } finally {
      setBasicInfoLoading(false);
    }
  }, []);

  const handleBasicInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBasicInfoSave = useCallback(async () => {
    if (!basicInfo.name.trim()) {
      setSnackbar({ open: true, message: '이름은 필수입니다.', severity: 'warning' });
      return;
    }
    setBasicInfoSaving(true);
    try {
      const { error } = await supabase
        .from('about_basic_info')
        .update({
          name: basicInfo.name.trim(),
          education: basicInfo.education.trim() || null,
          major: basicInfo.major.trim() || null,
          experience: basicInfo.experience.trim() || null,
          photo: basicInfo.photo.trim() || null,
          resume_url: basicInfo.resume_url?.trim() || null,
          portfolio_url: basicInfo.portfolio_url?.trim() || null,
        })
        .eq('id', 1);
      if (error) throw error;
      setSnackbar({ open: true, message: '기본 정보가 저장되었습니다.', severity: 'success' });
    } catch (err) {
      console.error('기본 정보 저장 실패:', err);
      setSnackbar({ open: true, message: '저장에 실패했습니다.', severity: 'error' });
    } finally {
      setBasicInfoSaving(false);
    }
  }, [basicInfo]);

  // === 섹션 함수 ===
  const fetchSections = useCallback(async () => {
    setSectionsLoading(true);
    try {
      const { data, error } = await supabase
        .from('about_sections')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (err) {
      console.error('섹션 로딩 실패:', err);
      setSnackbar({ open: true, message: '섹션 로딩에 실패했습니다.', severity: 'error' });
    } finally {
      setSectionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBasicInfo();
    fetchSections();
  }, [fetchBasicInfo, fetchSections]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleOpenAdd = useCallback(() => {
    setEditingSection(null);
    setFormData(emptySection);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((section) => {
    setEditingSection(section);
    setFormData({
      title: section.title || '',
      content: section.content || '',
      show_in_home: section.show_in_home ?? false,
      sort_order: section.sort_order ?? 0,
    });
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.title.trim()) {
      setSnackbar({ open: true, message: '섹션 제목은 필수입니다.', severity: 'warning' });
      return;
    }

    setSubmitting(true);
    const sectionData = {
      title: formData.title.trim(),
      content: formData.content.trim() || null,
      show_in_home: formData.show_in_home,
      sort_order: Number(formData.sort_order) || 0,
    };

    try {
      if (editingSection) {
        const { error } = await supabase
          .from('about_sections')
          .update(sectionData)
          .eq('id', editingSection.id);
        if (error) throw error;
        setSnackbar({ open: true, message: '섹션이 수정되었습니다.', severity: 'success' });
      } else {
        const { error } = await supabase
          .from('about_sections')
          .insert([sectionData]);
        if (error) throw error;
        setSnackbar({ open: true, message: '섹션이 추가되었습니다.', severity: 'success' });
      }
      setDialogOpen(false);
      fetchSections();
    } catch (err) {
      console.error('섹션 저장 실패:', err);
      setSnackbar({ open: true, message: '저장에 실패했습니다.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [formData, editingSection, fetchSections]);

  const handleDelete = useCallback(async () => {
    if (!editingSection) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('about_sections')
        .delete()
        .eq('id', editingSection.id);
      if (error) throw error;
      setSnackbar({ open: true, message: '섹션이 삭제되었습니다.', severity: 'success' });
      setDeleteDialogOpen(false);
      setEditingSection(null);
      fetchSections();
    } catch (err) {
      console.error('섹션 삭제 실패:', err);
      setSnackbar({ open: true, message: '삭제에 실패했습니다.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [editingSection, fetchSections]);

  const handleToggleShowInHome = useCallback(async (section) => {
    try {
      const { error } = await supabase
        .from('about_sections')
        .update({ show_in_home: !section.show_in_home })
        .eq('id', section.id);
      if (error) throw error;
      fetchSections();
    } catch (err) {
      console.error('홈 표시 상태 변경 실패:', err);
      setSnackbar({ open: true, message: '상태 변경에 실패했습니다.', severity: 'error' });
    }
  }, [fetchSections]);

  return (
    <Box>
      {/* 기본 정보 영역 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          기본 정보
        </Typography>

        {basicInfoLoading ? (
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="rectangular" height={56} />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
              <TextField fullWidth required name="name" label="이름" value={basicInfo.name} onChange={handleBasicInfoChange} />
              <TextField fullWidth name="education" label="학력" value={basicInfo.education} onChange={handleBasicInfoChange} />
              <TextField fullWidth name="major" label="전공" value={basicInfo.major} onChange={handleBasicInfoChange} />
              <TextField fullWidth name="experience" label="경력" value={basicInfo.experience} onChange={handleBasicInfoChange} />
              <ImageUpload value={basicInfo.photo} onChange={(url) => setBasicInfo((prev) => ({ ...prev, photo: url || '' }))} folder="about" label="프로필 사진" />
              <FileUpload value={basicInfo.resume_url} onChange={(url) => setBasicInfo((prev) => ({ ...prev, resume_url: url || '' }))} folder="documents" label="이력서 파일" />
              <FileUpload value={basicInfo.portfolio_url} onChange={(url) => setBasicInfo((prev) => ({ ...prev, portfolio_url: url || '' }))} folder="documents" label="포트폴리오 파일" />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleBasicInfoSave} disabled={basicInfoSaving}>
                  {basicInfoSaving ? '저장 중...' : '저장'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* 섹션 관리 영역 */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            소개 섹션 ({sections.length}개)
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            추가
          </Button>
        </Box>

        {sectionsLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid key={item} size={{ xs: 12, md: 6 }}>
                <Card><CardContent><Skeleton variant="text" width="60%" /><Skeleton variant="text" width="100%" /><Skeleton variant="text" width="80%" /></CardContent></Card>
              </Grid>
            ))}
          </Grid>
        ) : sections.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ color: 'text.secondary' }}>등록된 소개 섹션이 없습니다.</Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {sections.map((section) => (
              <Grid key={section.id} size={{ xs: 12, md: 6 }}>
                <Card sx={{ opacity: section.show_in_home ? 1 : 0.6 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                          {section.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                          {section.content?.length > 80
                            ? section.content.substring(0, 80) + '...'
                            : section.content}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        <IconButton size="small" onClick={() => handleOpenEdit(section)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => { setEditingSection(section); setDeleteDialogOpen(true); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        순서: {section.sort_order}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: section.show_in_home ? 'success.main' : 'text.secondary' }}>
                          {section.show_in_home ? '홈 표시' : '홈 미표시'}
                        </Typography>
                        <Switch size="small" checked={section.show_in_home} onChange={() => handleToggleShowInHome(section)} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* 섹션 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSection ? '섹션 수정' : '섹션 추가'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField fullWidth required name="title" label="섹션 제목" value={formData.title} onChange={handleInputChange} />
          <TextField fullWidth name="content" label="내용" multiline rows={5} value={formData.content} onChange={handleInputChange} />
          <TextField fullWidth name="sort_order" label="정렬 순서" type="number" value={formData.sort_order} onChange={handleInputChange} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch checked={formData.show_in_home} onChange={(e) => setFormData((prev) => ({ ...prev, show_in_home: e.target.checked }))} />
            <Typography variant="body2">{formData.show_in_home ? '홈에 표시' : '홈에 미표시'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '저장 중...' : editingSection ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>섹션 삭제</DialogTitle>
        <DialogContent>
          <Typography>"{editingSection?.title}" 섹션을 삭제하시겠습니까?</Typography>
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

export default AboutManager;
