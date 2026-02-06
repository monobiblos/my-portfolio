import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';

/**
 * HeroSection 컴포넌트 - 3D 브릴리언트 컷 다이아몬드 메인 비주얼 섹션
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
    camera.position.set(0, 0.5, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;

    // 환경 맵 생성 (그라데이션 큐브맵 시뮬레이션)
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);

    // 환경용 그라데이션 구 생성 (더 밝은 환경)
    const envGeometry = new THREE.SphereGeometry(50, 32, 32);
    const envMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(0x6e6e8a) },
        bottomColor: { value: new THREE.Color(0x3a3a4a) },
        offset: { value: 0 },
        exponent: { value: 0.6 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
    });
    const envMesh = new THREE.Mesh(envGeometry, envMaterial);
    scene.add(envMesh);

    // 환경 맵 업데이트
    envMesh.visible = true;
    cubeCamera.position.set(0, 0, 0);
    cubeCamera.update(renderer, scene);

    // Lighting (더 밝게)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // 메인 조명 (상단) - 강화
    const mainLight = new THREE.DirectionalLight(0xffffff, 3.5);
    mainLight.position.set(2, 5, 3);
    scene.add(mainLight);

    // 추가 메인 조명 (전면)
    const frontLight = new THREE.DirectionalLight(0xffffff, 2.5);
    frontLight.position.set(0, 2, 5);
    scene.add(frontLight);

    // 보조 조명들 (반짝임 효과용)
    const light1 = new THREE.PointLight(0xffffff, 3.0, 15);
    light1.position.set(-3, 2, 3);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 2.5, 15);
    light2.position.set(3, -1, 2);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xffffff, 4.0, 10);
    light3.position.set(0, 3, 2);
    scene.add(light3);

    // 핑크/블루 색상 조명 (이미지의 색감 반영) - 약하게
    const pinkLight = new THREE.PointLight(0xffc0cb, 0.8, 12);
    pinkLight.position.set(2, 0, -2);
    scene.add(pinkLight);

    const blueLight = new THREE.PointLight(0xc0d8ff, 0.8, 12);
    blueLight.position.set(-2, 1, -2);
    scene.add(blueLight);

    // 브릴리언트 컷 다이아몬드 지오메트리 생성
    const createBrilliantCutDiamond = () => {
      const vertices = [];
      const indices = [];

      // 다이아몬드 비율 (브릴리언트 컷 기준)
      const crownHeight = 0.35;
      const pavilionDepth = 0.85;
      const tableRadius = 0.5;
      const girdleRadius = 1.0;
      const totalHeight = crownHeight + pavilionDepth;

      // 중심점들
      const tableCenter = crownHeight;
      const girdleLevel = 0;
      const culetPoint = -pavilionDepth;

      // 16면 브릴리언트 컷 (각도)
      const numSides = 16;
      const angleStep = (Math.PI * 2) / numSides;

      // 정점 인덱스 추적
      let vertexIndex = 0;

      // 테이블 중심점
      vertices.push(0, tableCenter, 0);
      const tableCenterIndex = vertexIndex++;

      // 테이블 정점들 (8개)
      const tableVertices = [];
      for (let i = 0; i < 8; i++) {
        const angle = i * (Math.PI * 2) / 8;
        vertices.push(
          Math.cos(angle) * tableRadius,
          tableCenter,
          Math.sin(angle) * tableRadius
        );
        tableVertices.push(vertexIndex++);
      }

      // 스타 패싯 정점들 (8개 - 테이블과 거들 사이)
      const starVertices = [];
      for (let i = 0; i < 8; i++) {
        const angle = i * (Math.PI * 2) / 8 + (Math.PI / 8);
        const radius = (tableRadius + girdleRadius) * 0.5;
        const height = tableCenter * 0.6;
        vertices.push(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );
        starVertices.push(vertexIndex++);
      }

      // 거들 정점들 (16개)
      const girdleVertices = [];
      for (let i = 0; i < numSides; i++) {
        const angle = i * angleStep;
        vertices.push(
          Math.cos(angle) * girdleRadius,
          girdleLevel,
          Math.sin(angle) * girdleRadius
        );
        girdleVertices.push(vertexIndex++);
      }

      // 파빌리온 메인 패싯 정점들 (8개)
      const pavilionMainVertices = [];
      for (let i = 0; i < 8; i++) {
        const angle = i * (Math.PI * 2) / 8;
        const radius = girdleRadius * 0.4;
        const height = culetPoint * 0.5;
        vertices.push(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );
        pavilionMainVertices.push(vertexIndex++);
      }

      // 큘렛 (바닥 꼭짓점)
      vertices.push(0, culetPoint, 0);
      const culetIndex = vertexIndex++;

      // === 면 생성 ===

      // 테이블 면 (8개 삼각형)
      for (let i = 0; i < 8; i++) {
        const next = (i + 1) % 8;
        indices.push(tableCenterIndex, tableVertices[i], tableVertices[next]);
      }

      // 스타 패싯 (테이블 → 스타)
      for (let i = 0; i < 8; i++) {
        const next = (i + 1) % 8;
        indices.push(tableVertices[i], starVertices[i], tableVertices[next]);
        indices.push(tableVertices[next], starVertices[i], starVertices[next]);
      }

      // 베젤 패싯 (스타 → 거들)
      for (let i = 0; i < 8; i++) {
        const g1 = i * 2;
        const g2 = i * 2 + 1;
        const g3 = ((i + 1) * 2) % numSides;

        indices.push(starVertices[i], girdleVertices[g1], girdleVertices[g2]);
        indices.push(starVertices[i], girdleVertices[g2], starVertices[(i + 1) % 8]);
        indices.push(starVertices[(i + 1) % 8], girdleVertices[g2], girdleVertices[g3]);
      }

      // 파빌리온 메인 패싯 (거들 → 파빌리온 메인)
      for (let i = 0; i < 8; i++) {
        const g1 = i * 2;
        const g2 = i * 2 + 1;
        const g3 = ((i + 1) * 2) % numSides;

        indices.push(girdleVertices[g1], pavilionMainVertices[i], girdleVertices[g2]);
        indices.push(girdleVertices[g2], pavilionMainVertices[i], pavilionMainVertices[(i + 1) % 8]);
        indices.push(girdleVertices[g2], pavilionMainVertices[(i + 1) % 8], girdleVertices[g3]);
      }

      // 파빌리온 하단 패싯 (파빌리온 메인 → 큘렛)
      for (let i = 0; i < 8; i++) {
        const next = (i + 1) % 8;
        indices.push(pavilionMainVertices[i], culetIndex, pavilionMainVertices[next]);
      }

      // BufferGeometry 생성
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      return geometry;
    };

    // 다이아몬드 재질 (밝고 투명한 크리스탈)
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.02,
      transmission: 0.82,
      transparent: true,
      opacity: 0.9,
      thickness: 0.6,
      envMap: cubeRenderTarget.texture,
      envMapIntensity: 3.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      ior: 2.417, // 다이아몬드의 실제 굴절률
      reflectivity: 1.0,
      specularIntensity: 2.0,
      specularColor: new THREE.Color(0xffffff),
      side: THREE.DoubleSide,
      attenuationColor: new THREE.Color(0xffffff),
      attenuationDistance: 1.2,
      sheen: 0.3,
      sheenColor: new THREE.Color(0xffffff),
    });

    // 다이아몬드 메시 생성
    const diamondGeometry = createBrilliantCutDiamond();
    const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamond.scale.set(1.3, 1.3, 1.3);
    diamond.position.y = 0.8; // 중앙보다 위로 이동
    diamond.rotation.x = 0.15;
    diamond.rotation.z = 0.05;
    scene.add(diamond);

    // 다이아몬드 엣지 라인 (각진 선 표현)
    const edgesGeometry = new THREE.EdgesGeometry(diamondGeometry, 15);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      linewidth: 1,
    });
    const edgeLines = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    edgeLines.scale.set(1.3, 1.3, 1.3);
    edgeLines.position.y = 0.8;
    edgeLines.rotation.x = 0.15;
    edgeLines.rotation.z = 0.05;
    scene.add(edgeLines);

    // 내부 반사용 작은 다이아몬드 (투명하게)
    const innerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.7,
      transparent: true,
      opacity: 0.4,
      thickness: 0.3,
      envMap: cubeRenderTarget.texture,
      envMapIntensity: 2.5,
      ior: 2.0,
      side: THREE.BackSide,
      specularIntensity: 1.5,
    });

    const innerDiamond = new THREE.Mesh(diamondGeometry, innerMaterial);
    innerDiamond.scale.set(1.25, 1.25, 1.25);
    innerDiamond.position.y = 0.8; // 중앙보다 위로 이동
    innerDiamond.rotation.x = 0.15;
    innerDiamond.rotation.z = 0.05;
    scene.add(innerDiamond);

    // 반짝임 파티클 효과
    const sparkleCount = 50;
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    const sparkleSizes = new Float32Array(sparkleCount);

    for (let i = 0; i < sparkleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1.5;
      sparklePositions[i * 3] = Math.cos(angle) * radius;
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 2 + 0.8; // 다이아몬드 위치에 맞춤
      sparklePositions[i * 3 + 2] = Math.sin(angle) * radius;
      sparkleSizes[i] = Math.random() * 3 + 1;
    }

    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    sparkleGeometry.setAttribute('size', new THREE.BufferAttribute(sparkleSizes, 1));

    const sparkleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    scene.add(sparkles);

    // Animation
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.008;

      // 다이아몬드 천천히 회전
      diamond.rotation.y += 0.003;
      innerDiamond.rotation.y += 0.003;
      edgeLines.rotation.y += 0.003;

      // 조명 움직임 (반짝임 효과)
      light3.position.x = Math.sin(time * 2) * 2;
      light3.position.z = Math.cos(time * 1.5) * 2 + 2;
      light3.intensity = 2.5 + Math.sin(time * 3) * 1.0;

      pinkLight.intensity = 1.2 + Math.sin(time * 2.5) * 0.5;
      blueLight.intensity = 1.2 + Math.cos(time * 2) * 0.5;

      // 파티클 반짝임
      sparkles.rotation.y += 0.002;
      sparkleMaterial.opacity = 0.4 + Math.sin(time * 4) * 0.2;

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
      diamondGeometry.dispose();
      diamondMaterial.dispose();
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      innerMaterial.dispose();
      sparkleGeometry.dispose();
      sparkleMaterial.dispose();
      envGeometry.dispose();
      envMaterial.dispose();
    };
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 소셜 링크 데이터
  const socialLinks = [
    { icon: <GitHubIcon />, url: 'https://github.com', label: 'GitHub' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <EmailIcon />, url: 'mailto:example@email.com', label: 'Email' },
  ];

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
          pb: { xs: 14, md: 18 },
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem', lg: '3.5rem' },
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: '-0.01em',
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
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              textShadow: '0 0 40px rgba(196, 181, 253, 0.5), 0 0 80px rgba(167, 139, 250, 0.3)',
            }}
          >
            Diamond
          </Typography>
        </Box>

        {/* CTA 버튼 영역 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            mt: 4,
            pointerEvents: 'auto',
          }}
        >
          {/* 주요 CTA 버튼들 */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2, md: 3 },
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* Primary CTA - 프로젝트 보기 */}
            <Button
              variant="contained"
              size="large"
              startIcon={<WorkIcon />}
              onClick={() => handleScrollToSection('projects')}
              sx={{
                px: { xs: 3, md: 4 },
                py: { xs: 1.2, md: 1.5 },
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)',
                boxShadow: '0 4px 20px rgba(167, 139, 250, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 30px rgba(167, 139, 250, 0.6)',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                },
                '&:active': {
                  transform: 'translateY(-1px)',
                },
              }}
            >
              프로젝트 보기
            </Button>

            {/* Secondary CTA - 연락하기 */}
            <Button
              variant="outlined"
              size="large"
              startIcon={<EmailIcon />}
              onClick={() => handleScrollToSection('contact')}
              sx={{
                px: { xs: 3, md: 4 },
                py: { xs: 1.2, md: 1.5 },
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                borderRadius: 2,
                borderColor: 'rgba(196, 181, 253, 0.5)',
                color: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(196, 181, 253, 0.15)',
                  boxShadow: '0 4px 20px rgba(196, 181, 253, 0.3)',
                },
              }}
            >
              연락하기
            </Button>
          </Box>

          {/* 소셜 링크 */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              mt: 1,
            }}
          >
            {socialLinks.map((social) => (
              <Tooltip
                key={social.label}
                title={social.label}
                placement="bottom"
                TransitionComponent={Fade}
                arrow
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                      fontSize: '0.75rem',
                    },
                  },
                }}
              >
                <IconButton
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(196, 181, 253, 0.15)',
                      transform: 'translateY(-3px) scale(1.1)',
                      boxShadow: '0 4px 15px rgba(196, 181, 253, 0.3)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
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
