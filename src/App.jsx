import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './components/common/header';

const HomePage = lazy(() => import('./pages/home-page'));
const AboutPage = lazy(() => import('./pages/about-page'));
const DesignsPage = lazy(() => import('./pages/designs-page'));
const ProjectsPage = lazy(() => import('./pages/projects-page'));
const AdminPage = lazy(() => import('./pages/admin-page'));

function LoadingFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress sx={{ color: 'primary.main' }} />
    </Box>
  );
}

/**
 * App 컴포넌트 - 메인 애플리케이션 라우터
 *
 * Props: 없음
 *
 * Example usage:
 * <App />
 */
function App() {
  return (
    <HashRouter>
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Header />
        <Box sx={{ pt: { xs: 7, md: 8 } }}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/designs" element={<DesignsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </HashRouter>
  );
}

export default App;
