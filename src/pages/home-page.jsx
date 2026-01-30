import Box from '@mui/material/Box';
import HeroSection from '../components/landing/hero-section';
import AboutSection from '../components/landing/about-section';
import SkillTreeSection from '../components/landing/skill-tree-section';
import ProjectsSection from '../components/landing/projects-section';
import ContactSection from '../components/landing/contact-section';

/**
 * HomePage 컴포넌트 - 메인 홈 페이지
 *
 * Props: 없음
 *
 * Example usage:
 * <HomePage />
 */
function HomePage() {
  return (
    <Box component="main">
      <HeroSection />
      <Box className="section-divider" />
      <AboutSection />
      <Box className="section-divider" />
      <SkillTreeSection />
      <Box className="section-divider" />
      <ProjectsSection />
      <Box className="section-divider" />
      <ContactSection />
    </Box>
  );
}

export default HomePage;
