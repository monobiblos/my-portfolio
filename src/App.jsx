import { HashRouter, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Header from './components/common/header';
import HomePage from './pages/home-page';
import AboutPage from './pages/about-page';
import ProjectsPage from './pages/projects-page';

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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </Box>
      </Box>
    </HashRouter>
  );
}

export default App;
