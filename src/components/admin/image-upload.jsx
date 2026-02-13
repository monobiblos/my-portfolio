import { useState, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../../utils/supabase';

const BUCKET = 'portfolio-images';

function extractStoragePath(url) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.substring(idx + marker.length);
}

function ImageUpload({ value = '', onChange, folder = 'images', label = '이미지' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setUploading(true);
    setError('');

    const ext = file.name.split('.').pop();
    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      setError('업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [folder, onChange]);

  const handleDelete = useCallback(async () => {
    const storagePath = extractStoragePath(value);

    if (storagePath) {
      try {
        await supabase.storage.from(BUCKET).remove([storagePath]);
      } catch (err) {
        console.error('이미지 삭제 실패:', err);
      }
    }

    onChange('');
  }, [value, onChange]);

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
        {label}
      </Typography>

      {value && (
        <Box sx={{ position: 'relative', mb: 1.5, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
          <Box
            component="img"
            src={value}
            alt={label}
            sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }}
          />
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileSelect}
      />

      <Button
        variant="outlined"
        size="small"
        startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        fullWidth
        sx={{ py: 1 }}
      >
        {uploading ? '업로드 중...' : value ? '이미지 변경' : '이미지 선택'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default ImageUpload;
