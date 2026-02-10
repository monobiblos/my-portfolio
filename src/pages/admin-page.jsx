import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LockIcon from '@mui/icons-material/Lock';
import ProjectManager from '../components/admin/project-manager';
import GuestbookManager from '../components/admin/guestbook-manager';

const ADMIN_PASSWORD_HASH = '2746790b33c996e2f77552cc80b3455a684b0532513900be5e6466dbb2e413f4';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('admin_auth') === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    const hash = await hashPassword(password);
    if (hash === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  }, [password]);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  }, []);

  if (!isAuthenticated) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <LockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              관리자 인증
            </Typography>
            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                type="password"
                label="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                helperText={error}
                sx={{ mb: 2 }}
                autoFocus
              />
              <Button type="submit" variant="contained" fullWidth sx={{ py: 1.5 }}>
                로그인
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', py: { xs: 10, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.2em' }}>
              ADMIN
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              관리자 대시보드
            </Typography>
          </Box>
          <Button variant="outlined" color="error" onClick={handleLogout} size="small">
            로그아웃
          </Button>
        </Box>

        <Card sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
              },
              '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
            }}
          >
            <Tab label="프로젝트 관리" />
            <Tab label="방명록 관리" />
          </Tabs>
        </Card>

        {activeTab === 0 && <ProjectManager />}
        {activeTab === 1 && <GuestbookManager />}
      </Container>
    </Box>
  );
}

export default AdminPage;
