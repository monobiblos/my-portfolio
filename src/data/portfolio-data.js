/**
 * 포트폴리오 공유 데이터
 * 홈 탭과 About Me 탭에서 공통으로 사용하는 데이터
 */

// About Me 기본 정보
export const aboutMeData = {
  basicInfo: {
    name: '황지선',
    education: '상일미디어고등학교 졸업',
    major: '디지털만화영상과 출신',
    experience: '2015년부터 활동, 웹디자이너로서 5년 6개월',
    photo: '',
  },
  sections: [
    {
      id: 'dev-story',
      title: 'My Story',
      content: '어릴 적부터 창의적인 생각을 하는 것을 좋아했다. 광고 디자이너가 꿈일 적도 있었다. 지금은 내 머릿속의 이미지를 현실로 그려내는 것이 좋다.',
      showInHome: true,
    },
    {
      id: 'philosophy',
      title: 'My Philosophy',
      content: '자연만이 주는 아름다움을, 인간만이 주는 따스함을 잊지 않는다.',
      showInHome: true,
    },
    {
      id: 'personal',
      title: 'My Favorite',
      content: '디자인만큼 디자인성이 있는 게임이 좋아서 웬종일 전기공사만 하느라 곤란. 꽃을 좋아한다.',
      showInHome: false,
    },
  ],
};

// 스킬 데이터 (level 순서대로 정렬)
export const skillsData = [
  {
    id: 1,
    icon: 'figma',
    name: 'Figma',
    level: 90,
    category: 'Design',
    description: 'UI/UX 디자인, 프로토타이핑, 디자인 시스템',
    showInHome: true,
  },
  {
    id: 2,
    icon: 'photoshop',
    name: 'Photoshop',
    level: 90,
    category: 'Design',
    description: '이미지 편집, 합성, 그래픽 디자인',
    showInHome: true,
  },
  {
    id: 3,
    icon: 'html',
    name: 'HTML',
    level: 80,
    category: 'Frontend',
    description: '시맨틱 마크업, 접근성 고려한 구조 설계',
    showInHome: true,
  },
  {
    id: 4,
    icon: 'illustration',
    name: 'Illustration',
    level: 80,
    category: 'Design',
    description: '일러스트레이션, 벡터 그래픽, 아이콘 디자인',
    showInHome: true,
  },
  {
    id: 5,
    icon: 'css',
    name: 'CSS',
    level: 75,
    category: 'Frontend',
    description: 'Flexbox, Grid, 반응형 디자인, 애니메이션',
    showInHome: true,
  },
  {
    id: 6,
    icon: 'javascript',
    name: 'JavaScript',
    level: 60,
    category: 'Frontend',
    description: 'ES6+, DOM 조작, 비동기 처리',
    showInHome: true,
  },
  {
    id: 7,
    icon: 'react',
    name: 'React',
    level: 60,
    category: 'Framework',
    description: 'Hooks, 상태관리, 컴포넌트 설계',
    showInHome: true,
  },
  {
    id: 8,
    icon: 'excel',
    name: 'Excel',
    level: 60,
    category: 'etc',
    description: '데이터 분석, 함수 활용, 문서 작성',
    showInHome: true,
  },
];

// 카테고리별 색상
export const categoryColors = {
  Frontend: { main: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' },
  Framework: { main: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  Design: { main: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
  Backend: { main: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  Tools: { main: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
  etc: { main: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)' },
};

// 홈에 표시할 섹션 필터링
export const getHomeSections = () => {
  return aboutMeData.sections.filter((section) => section.showInHome);
};

// 홈에 표시할 스킬 필터링 (레벨 높은 순)
export const getHomeSkills = () => {
  return [...skillsData]
    .filter((skill) => skill.showInHome)
    .sort((a, b) => b.level - a.level);
};

// 카테고리 목록 가져오기
export const getCategories = () => {
  const homeSkills = getHomeSkills();
  return [...new Set(homeSkills.map((s) => s.category))];
};
