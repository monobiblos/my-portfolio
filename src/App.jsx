import { lazy, Suspense, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Header from './components/common/header';
import PageTransition from './components/common/page-transition';

const HomePage = lazy(() => import('./pages/home-page'));
const AboutPage = lazy(() => import('./pages/about-page'));
const DesignsPage = lazy(() => import('./pages/designs-page'));
const ProjectsPage = lazy(() => import('./pages/projects-page'));
const AdminPage = lazy(() => import('./pages/admin-page'));

function AppContent() {
  const location = useLocation();
  const [transitioning, setTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTimeout(() => setTransitioning(false), 300);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation.pathname]);

  return (
    <>
      <PageTransition active={transitioning} />
      <Header />
      <Box sx={{ pt: { xs: 7, md: 8 } }}>
        <Suspense fallback={<PageTransition active />}>
          <Routes location={displayLocation}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/designs" element={<DesignsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </Box>
    </>
  );
}

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
        <AppContent />
      </Box>
    </HashRouter>
  );
}

export default App;
