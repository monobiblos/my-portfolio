import { useState, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { supabase } from '../../utils/supabase';

const BUCKET = 'portfolio-images';

function extractStoragePath(url) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.substring(idx + marker.length);
}

function getFileName(url) {
  if (!url) return '';
  const parts = url.split('/');
  const raw = parts[parts.length - 1];
  // timestamp-random.ext 형식에서 원본 확장자만 표시
  const dotIdx = raw.lastIndexOf('.');
  return dotIdx > 0 ? `업로드된 파일${raw.substring(dotIdx)}` : raw;
}

function FileUpload({ value = '', onChange, folder = 'documents', label = '파일', accept = '.pdf,.doc,.docx,.pptx,.hwp' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError('파일 크기는 20MB 이하여야 합니다.');
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
      console.error('파일 업로드 실패:', err);
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
        console.error('파일 삭제 실패:', err);
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'action.hover' }}>
          <InsertDriveFileIcon sx={{ color: 'primary.main' }} />
          <Typography
            variant="body2"
            component="a"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ flex: 1, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {getFileName(value)}
          </Typography>
          <IconButton size="small" onClick={handleDelete} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
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
        {uploading ? '업로드 중...' : value ? '파일 변경' : '파일 선택'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default FileUpload;
