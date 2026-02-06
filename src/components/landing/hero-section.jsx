import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * HeroSection 컴포넌트 - 3D 크리스탈 메인 비주얼 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <HeroSection />
 */
function HeroSection() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Main Light
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Rim Light (엣지 강조용 - 보라색 톤)
    const rim = new THREE.PointLight(0xc4b5fd, 2.0);
    rim.position.set(-5, -5, 5);
    scene.add(rim);

    // 보라색 포인트 라이트
    const purpleLight = new THREE.PointLight(0xa78bfa, 1.5);
    purpleLight.position.set(3, -3, 3);
    scene.add(purpleLight);

    // 추가 하이라이트 라이트 (반짝임용)
    const highlightLight = new THREE.PointLight(0xffffff, 2.0);
    highlightLight.position.set(0, 3, 3);
    scene.add(highlightLight);

    // Crystal Material - 다이아몬드 유리
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.95,
      transparent: true,
      opacity: 0.6,
      thickness: 0.5,
      envMapIntensity: 3.0,
      clearcoat: 1,
      clearcoatRoughness: 0.0,
      ior: 2.417,
      reflectivity: 1.0,
      side: THREE.DoubleSide,
    });

    // Diamond Shape Group
    const diamond = new THREE.Group();
    scene.add(diamond);

    // 크라운 (상단) - 넓고 얕은 팔각형 피라미드
    const crownGeometry = new THREE.ConeGeometry(1.0, 0.6, 8);
    const crown = new THREE.Mesh(crownGeometry, material);
    crown.position.y = 0.3;
    crown.rotation.x = Math.PI;
    diamond.add(crown);

    // 테이블 (상단 평면) - 얇은 팔각형
    const tableGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 8);
    const table = new THREE.Mesh(tableGeometry, material);
    table.position.y = 0.6;
    diamond.add(table);

    // 파빌리온 (하단) - 길고 뾰족한 팔각형 피라미드
    const pavilionGeometry = new THREE.ConeGeometry(1.0, 1.8, 8);
    const pavilion = new THREE.Mesh(pavilionGeometry, material);
    pavilion.position.y = -0.9;
    diamond.add(pavilion);

    // 거들 (중간 띠) - 얇은 팔각형 기둥
    const girdleGeometry = new THREE.CylinderGeometry(1.0, 1.0, 0.08, 8);
    const girdle = new THREE.Mesh(girdleGeometry, material);
    girdle.position.y = 0;
    diamond.add(girdle);

    // 다이아몬드 약간 기울임
    diamond.rotation.x = 0.15;

    // Shattered pieces - 작은 다이아몬드 파편들
    const shards = [];
    for (let i = 0; i < 12; i++) {
      const shardMaterial = new THREE.MeshPhysicalMaterial({
        color: i % 3 === 0 ? 0xc4b5fd : 0xffffff,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.9,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.2,
        thickness: 0.3,
        clearcoat: 1,
        ior: 2.417,
        reflectivity: 1.0,
        side: THREE.DoubleSide,
      });

      // 작은 다이아몬드 파편 (옥타헤드론)
      const size = 0.1 + Math.random() * 0.15;
      const shard = new THREE.Mesh(
        new THREE.OctahedronGeometry(size, 0),
        shardMaterial
      );

      const angle = (i / 12) * Math.PI * 2;
      const radius2 = 1.8 + Math.random() * 0.6;
      shard.position.set(
        Math.cos(angle) * radius2,
        (Math.random() - 0.5) * 2.5,
        Math.sin(angle) * radius2
      );

      // 랜덤 회전
      shard.rotation.x = Math.random() * Math.PI;
      shard.rotation.z = Math.random() * Math.PI;

      shard.userData.speed = 0.003 + Math.random() * 0.008;
      shard.userData.angle = angle;
      shard.userData.radius = radius2;
      shard.userData.yOffset = shard.position.y;
      shard.userData.rotSpeed = (Math.random() - 0.5) * 0.02;

      scene.add(shard);
      shards.push(shard);
    }

    // Animation
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;

      // Main diamond slow rotation
      diamond.rotation.y += 0.002;

      // 하이라이트 라이트 움직임 (반짝임 효과)
      highlightLight.position.x = Math.sin(time * 2) * 3;
      highlightLight.position.y = Math.cos(time * 1.5) * 2 + 2;
      highlightLight.intensity = 1.5 + Math.sin(time * 3) * 0.5;

      // Shards orbit and float
      shards.forEach((shard) => {
        shard.userData.angle += shard.userData.speed;
        shard.position.x = Math.cos(shard.userData.angle) * shard.userData.radius;
        shard.position.z = Math.sin(shard.userData.angle) * shard.userData.radius;
        shard.position.y = shard.userData.yOffset + Math.sin(time * 2 + shard.userData.angle) * 0.3;
        shard.rotation.y += shard.userData.rotSpeed;
        shard.rotation.x += shard.userData.rotSpeed * 0.5;
      });

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      crownGeometry.dispose();
      tableGeometry.dispose();
      pavilionGeometry.dispose();
      girdleGeometry.dispose();
      material.dispose();
      shards.forEach((shard) => {
        shard.geometry.dispose();
        shard.material.dispose();
      });
    };
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Three.js Canvas */}
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* Shimmer Overlay Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
          background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.03) 45%, rgba(196, 181, 253, 0.08) 50%, rgba(255, 255, 255, 0.03) 55%, transparent 60%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 4s infinite linear',
          '@keyframes shimmer': {
            '0%': {
              backgroundPosition: '200% 0',
            },
            '100%': {
              backgroundPosition: '-200% 0',
            },
          },
        }}
      />

      {/* Typography Overlay */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 3,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pb: { xs: 12, md: 16 },
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem', lg: '3.5rem' },
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: { xs: '0.1em', md: '0.2em' },
              textTransform: 'uppercase',
              filter: 'blur(0.5px)',
              textShadow: '0 0 30px rgba(196, 181, 253, 0.3)',
              mb: 1,
            }}
          >
            Eventually, becomes a
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '6rem' },
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: { xs: '0.1em', md: '0.15em' },
              textTransform: 'uppercase',
              textShadow: '0 0 40px rgba(196, 181, 253, 0.5), 0 0 80px rgba(167, 139, 250, 0.3)',
            }}
          >
            Diamond
          </Typography>
        </Box>
      </Container>

      {/* Scroll Down Indicator */}
      <Box
        onClick={handleScrollDown}
        sx={{
          position: 'absolute',
          bottom: { xs: 24, md: 40 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: 'translateX(-50%) translateY(0)',
            },
            '40%': {
              transform: 'translateX(-50%) translateY(-10px)',
            },
            '60%': {
              transform: 'translateX(-50%) translateY(-5px)',
            },
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.2em',
            fontSize: { xs: '0.6rem', md: '0.7rem' },
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </Typography>
        <KeyboardArrowDownIcon
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: { xs: 24, md: 32 },
          }}
        />
      </Box>
    </Box>
  );
}

export default HeroSection;
