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
    // Ambient Light (전체 기본광)
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Main Light
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Rim Light (엣지 강조용 - 보라색 톤)
    const rim = new THREE.PointLight(0xc4b5fd, 1.5);
    rim.position.set(-5, -5, 5);
    scene.add(rim);

    // 보라색 포인트 라이트
    const purpleLight = new THREE.PointLight(0xa78bfa, 1.0);
    purpleLight.position.set(3, -3, 3);
    scene.add(purpleLight);

    // Crystal Material - 깨진 유리 효과
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.98,
      transparent: true,
      opacity: 0.4,
      thickness: 0.5,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.0,
      ior: 1.5,
      reflectivity: 0.9,
      side: THREE.DoubleSide,
    });

    // Main Crystal (박살난 효과 - Icosahedron)
    const crystalGeometry = new THREE.IcosahedronGeometry(1.2, 0);
    const crystal = new THREE.Mesh(crystalGeometry, material);
    scene.add(crystal);

    // Shattered pieces (여러 조각으로 박살) - 깨진 유리 파편
    const shards = [];
    for (let i = 0; i < 8; i++) {
      const shardMaterial = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0xc4b5fd : 0xffffff,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.95,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.2,
        thickness: 0.3,
        clearcoat: 1,
        ior: 1.5,
        side: THREE.DoubleSide,
      });

      const shard = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.25 + Math.random() * 0.2, 0),
        shardMaterial
      );

      const angle = (i / 8) * Math.PI * 2;
      const radius = 1.8 + Math.random() * 0.5;
      shard.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 1.5,
        Math.sin(angle) * radius
      );

      shard.userData.speed = 0.005 + Math.random() * 0.01;
      shard.userData.angle = angle;
      shard.userData.radius = radius;
      shard.userData.yOffset = shard.position.y;

      scene.add(shard);
      shards.push(shard);
    }

    // Animation
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;

      // Main crystal rotation
      crystal.rotation.y += 0.003;
      crystal.rotation.x += 0.0015;

      // Shards orbit and float
      shards.forEach((shard) => {
        shard.userData.angle += shard.userData.speed;
        shard.position.x = Math.cos(shard.userData.angle) * shard.userData.radius;
        shard.position.z = Math.sin(shard.userData.angle) * shard.userData.radius;
        shard.position.y = shard.userData.yOffset + Math.sin(time * 2 + shard.userData.angle) * 0.2;
        shard.rotation.x += 0.01;
        shard.rotation.y += 0.015;
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
      crystalGeometry.dispose();
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

      {/* Typography Overlay */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
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
          zIndex: 3,
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
