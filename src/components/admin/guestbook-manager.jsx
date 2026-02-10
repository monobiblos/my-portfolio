import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../../utils/supabase';

function GuestbookManager() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('방명록 로딩 실패:', err);
      setSnackbar({ open: true, message: '방명록 로딩에 실패했습니다.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('portfolio_guestbook')
        .delete()
        .eq('id', deleteTarget.id);
      if (error) throw error;
      setSnackbar({ open: true, message: '방명록이 삭제되었습니다.', severity: 'success' });
      setDeleteTarget(null);
      fetchEntries();
    } catch (err) {
      console.error('방명록 삭제 실패:', err);
      setSnackbar({ open: true, message: '삭제에 실패했습니다.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [deleteTarget, fetchEntries]);

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

  if (loading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid key={item} size={{ xs: 12, sm: 6 }}>
            <Card sx={{ p: 2 }}><Skeleton variant="text" width="40%" /><Skeleton variant="text" width="100%" /><Skeleton variant="text" width="60%" /></Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          방명록 ({entries.length}개)
        </Typography>
      </Box>

      {entries.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: 'text.secondary' }}>등록된 방명록이 없습니다.</Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {entries.map((entry) => (
            <Grid key={entry.id} size={{ xs: 12, sm: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {entry.author_name}
                      </Typography>
                      {entry.sns_account && (
                        <Typography variant="caption" sx={{ color: 'primary.main' }}>
                          {entry.sns_account}
                        </Typography>
                      )}
                    </Box>
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(entry)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {entry.hobby && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                      {entry.hobby}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6 }}>
                    {entry.message}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                    {formatDate(entry.created_at)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>방명록 삭제</DialogTitle>
        <DialogContent>
          <Typography>"{deleteTarget?.author_name}"님의 방명록을 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>취소</Button>
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

export default GuestbookManager;
