import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';

/**
 * DesignDetailModal 컴포넌트 - 디자인 상세 보기 모달
 *
 * Props:
 * @param {boolean} isOpen - 모달 열림 여부
 * @param {function} onClose - 모달 닫기 함수
 * @param {object|null} design - 표시할 디자인 데이터
 *
 * Example usage:
 * <DesignDetailModal isOpen={modalOpen} onClose={handleClose} design={selectedDesign} />
 */
function DesignDetailModal({ isOpen, onClose, design = null }) {
  return (
    <Dialog
      open={isOpen && !!design}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.secondary',
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 0 }}>
        {design?.image_url && (
          <Box
            component="img"
            src={design.image_url}
            alt={design?.title}
            sx={{
              width: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              display: 'block',
              backgroundColor: 'background.default',
            }}
          />
        )}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              mb: 1,
              color: 'text.primary',
            }}
          >
            {design?.title}
          </Typography>
          {design?.description && (
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.7,
              }}
            >
              {design.description}
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default DesignDetailModal;
