import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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

    let disposed = false;
    let animationId = null;

    import('three').then((THREE) => {
      if (disposed || !canvasRef.current) return;

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
    diamond.position.y = 1.0; // 20% 더 위로 이동 (0.8 → 1.0)
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
    edgeLines.position.y = 1.0;
    edgeLines.rotation.x = 0.15;
    edgeLines.rotation.z = 0.05;
    scene.add(edgeLines);

    // 설계도 스타일 검은색 엣지 라인 (살짝 회전)
    const blueprintEdgesMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
      linewidth: 1,
    });
    const blueprintEdgeLines = new THREE.LineSegments(edgesGeometry, blueprintEdgesMaterial);
    blueprintEdgeLines.scale.set(1.35, 1.35, 1.35); // 약간 더 크게
    blueprintEdgeLines.position.y = 1.0;
    blueprintEdgeLines.rotation.x = 0.15 + 0.08; // 살짝 다르게 회전
    blueprintEdgeLines.rotation.y = 0.12; // Y축으로 살짝 회전
    blueprintEdgeLines.rotation.z = 0.05 - 0.06;
    scene.add(blueprintEdgeLines);

    // 파빌리온(하단 기둥) 금색 라인
    const createPavilionLines = () => {
      const points = [];
      const numSides = 8;
      const girdleRadius = 1.0;
      const pavilionDepth = 0.85;
      const girdleLevel = 0;
      const culetPoint = -pavilionDepth;

      // 거들에서 큘렛까지의 주요 라인들
      for (let i = 0; i < numSides; i++) {
        const angle = i * (Math.PI * 2) / numSides;
        // 거들 포인트
        const girdleX = Math.cos(angle) * girdleRadius;
        const girdleZ = Math.sin(angle) * girdleRadius;
        // 큘렛으로 연결
        points.push(new THREE.Vector3(girdleX, girdleLevel, girdleZ));
        points.push(new THREE.Vector3(0, culetPoint, 0));
      }

      // 거들 링 (하단 테두리)
      for (let i = 0; i < numSides * 2; i++) {
        const angle1 = i * (Math.PI * 2) / (numSides * 2);
        const angle2 = (i + 1) * (Math.PI * 2) / (numSides * 2);
        points.push(new THREE.Vector3(
          Math.cos(angle1) * girdleRadius,
          girdleLevel,
          Math.sin(angle1) * girdleRadius
        ));
        points.push(new THREE.Vector3(
          Math.cos(angle2) * girdleRadius,
          girdleLevel,
          Math.sin(angle2) * girdleRadius
        ));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return geometry;
    };

    const pavilionLinesGeometry = createPavilionLines();
    const pavilionLinesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff, // 하얀색
      transparent: true,
      opacity: 0.6,
      linewidth: 1,
    });
    const pavilionLines = new THREE.LineSegments(pavilionLinesGeometry, pavilionLinesMaterial);
    pavilionLines.scale.set(1.32, 1.32, 1.32);
    pavilionLines.position.y = 1.0;
    pavilionLines.rotation.x = 0.15;
    pavilionLines.rotation.z = 0.05;
    scene.add(pavilionLines);

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
    innerDiamond.position.y = 1.0; // 20% 더 위로 이동
    innerDiamond.rotation.x = 0.15;
    innerDiamond.rotation.z = 0.05;
    scene.add(innerDiamond);

    // === 대왕고래 뼈 (와이어프레임) ===
    const createWhaleSkeletonLines = () => {
      const pts = [];
      const addLine = (a, b) => { pts.push(a.clone(), b.clone()); };
      const addCurve = (arr) => {
        for (let i = 0; i < arr.length - 1; i++) pts.push(arr[i].clone(), arr[i + 1].clone());
      };

      // --- 척추 (Spine) ---
      const spine = [];
      const spineLen = 14;
      const spineN = 50;
      for (let i = 0; i <= spineN; i++) {
        const t = i / spineN;
        const x = (t - 0.35) * spineLen;
        const y = Math.sin(t * Math.PI * 0.25) * 0.6 - t * t * 0.4;
        spine.push(new THREE.Vector3(x, y, 0));
      }
      addCurve(spine);

      // 척추 돌기 (등쪽 + 배쪽)
      for (let i = 2; i < spineN; i += 2) {
        const sp = spine[i];
        const progress = i / spineN;
        const size = (progress < 0.6 ? 0.2 + progress * 0.3 : 0.38 * (1 - (progress - 0.6) / 0.4)) * 0.8;
        addLine(sp, new THREE.Vector3(sp.x, sp.y + size, sp.z));
        if (progress > 0.15 && progress < 0.7) {
          addLine(sp, new THREE.Vector3(sp.x, sp.y - size * 0.5, sp.z));
        }
      }

      // --- 두개골 (Skull) ---
      const head = spine[0];
      const jawLen = 3.8;

      // 상악 (Upper jaw) - 양쪽
      const upperL = [], upperR = [];
      for (let i = 0; i <= 12; i++) {
        const t = i / 12;
        const x = head.x - t * jawLen;
        const y = head.y + 0.15 - t * 0.1 - Math.pow(t, 2) * 0.08;
        const zw = 0.2 * (1 - t * 0.6);
        upperL.push(new THREE.Vector3(x, y, zw));
        upperR.push(new THREE.Vector3(x, y, -zw));
      }
      addCurve(upperL);
      addCurve(upperR);
      // 상악 끝을 연결
      addLine(upperL[upperL.length - 1], upperR[upperR.length - 1]);

      // 상악 가로대
      for (let i = 3; i < 12; i += 3) {
        addLine(upperL[i], upperR[i]);
      }

      // 하악 (Mandible) - 양쪽으로 활처럼 벌어짐
      const lowerL = [], lowerR = [];
      for (let i = 0; i <= 14; i++) {
        const t = i / 14;
        const x = head.x - 0.2 - t * jawLen * 0.85;
        const y = head.y - 0.25 - Math.sin(t * Math.PI * 0.4) * 0.5;
        const z = Math.sin(t * Math.PI) * 0.65;
        lowerL.push(new THREE.Vector3(x, y, z));
        lowerR.push(new THREE.Vector3(x, y, -z));
      }
      addCurve(lowerL);
      addCurve(lowerR);

      // 하악-두개골 연결
      addLine(head, lowerL[0]);
      addLine(head, lowerR[0]);
      // 하악 끝-상악 끝 연결
      addLine(lowerL[lowerL.length - 1], upperL[upperL.length - 1]);
      addLine(lowerR[lowerR.length - 1], upperR[upperR.length - 1]);

      // 두개골 후방 (뒤통수) 연결
      const skullBack1 = new THREE.Vector3(head.x + 0.3, head.y + 0.35, 0.3);
      const skullBack2 = new THREE.Vector3(head.x + 0.3, head.y + 0.35, -0.3);
      addLine(head, skullBack1);
      addLine(head, skullBack2);
      addLine(skullBack1, skullBack2);
      addLine(skullBack1, upperL[0]);
      addLine(skullBack2, upperR[0]);

      // --- 갈비뼈 (Ribs) - 16쌍 ---
      const ribStartT = 0.08;
      const ribEndT = 0.52;
      const numRibs = 16;

      for (let r = 0; r < numRibs; r++) {
        const rt = r / (numRibs - 1);
        const spineT = ribStartT + rt * (ribEndT - ribStartT);
        const si = Math.min(Math.floor(spineT * spineN), spine.length - 1);
        const sp = spine[si];

        const sizeScale = Math.sin(rt * Math.PI);
        const ribH = sizeScale * 1.9 + 0.25;
        const ribW = sizeScale * 0.95 + 0.12;

        for (let side = -1; side <= 1; side += 2) {
          const ribPts = [];
          const ribSegs = 10;
          for (let s = 0; s <= ribSegs; s++) {
            const st = s / ribSegs;
            ribPts.push(new THREE.Vector3(
              sp.x + Math.sin(st * 0.3) * 0.05,
              sp.y - Math.sin(st * Math.PI * 0.55) * ribH,
              side * Math.sin(st * Math.PI * 0.45) * ribW,
            ));
          }
          addCurve(ribPts);
        }
      }

      // --- 견갑골 + 가슴지느러미 뼈 ---
      const pecIdx = Math.floor(0.13 * spineN);
      const psp = spine[pecIdx];

      for (let side = -1; side <= 1; side += 2) {
        // 견갑골
        const scapA = new THREE.Vector3(psp.x - 0.1, psp.y - 0.35, side * 0.55);
        const scapB = new THREE.Vector3(psp.x + 0.25, psp.y - 0.85, side * 0.75);
        addLine(new THREE.Vector3(psp.x, psp.y, side * 0.35), scapA);
        addLine(scapA, scapB);

        // 상완골
        const humerus = new THREE.Vector3(psp.x + 0.15, psp.y - 1.3, side * 0.95);
        addLine(scapB, humerus);

        // 요골/척골
        const radius = new THREE.Vector3(psp.x + 0.45, psp.y - 1.65, side * 1.0);
        const ulna = new THREE.Vector3(psp.x + 0.05, psp.y - 1.7, side * 1.1);
        addLine(humerus, radius);
        addLine(humerus, ulna);

        // 지골 (4개)
        for (let f = 0; f < 4; f++) {
          const ft = f / 3;
          const base = new THREE.Vector3(
            radius.x * (1 - ft) + ulna.x * ft,
            humerus.y - 0.55,
            side * (0.9 + ft * 0.12),
          );
          const tip = new THREE.Vector3(base.x + 0.2, base.y - 0.55, base.z + side * 0.03);
          const mid = new THREE.Vector3((base.x + tip.x) / 2, (base.y + tip.y) / 2 - 0.05, (base.z + tip.z) / 2);
          addLine(radius, base);
          addLine(base, mid);
          addLine(mid, tip);
        }
      }

      // --- 꼬리뼈 미판 (Tail Fluke 연결) ---
      const tailStart = Math.floor(0.75 * spineN);
      const tailEnd = spine[spineN];
      // 꼬리 끝에서 위아래로 펼쳐지는 구조
      const flukeUp = new THREE.Vector3(tailEnd.x + 0.8, tailEnd.y + 0.7, 0);
      const flukeDown = new THREE.Vector3(tailEnd.x + 0.8, tailEnd.y - 0.9, 0);
      addLine(tailEnd, flukeUp);
      addLine(tailEnd, flukeDown);
      // 미판 뼈 갈래
      for (let f = 0; f < 3; f++) {
        const ft = (f + 1) / 4;
        addLine(tailEnd, new THREE.Vector3(tailEnd.x + 0.5 + ft * 0.4, tailEnd.y + ft * 0.8, (f - 1) * 0.15));
        addLine(tailEnd, new THREE.Vector3(tailEnd.x + 0.5 + ft * 0.4, tailEnd.y - ft * 1.0, (f - 1) * 0.15));
      }

      // 꼬리 쪽 V자형 chevron 뼈
      for (let i = tailStart; i < spineN; i += 3) {
        const sp = spine[i];
        const progress = (i - tailStart) / (spineN - tailStart);
        const chevSize = (1 - progress) * 0.35 + 0.05;
        const chevL = new THREE.Vector3(sp.x + 0.05, sp.y - chevSize, 0.08);
        const chevR = new THREE.Vector3(sp.x + 0.05, sp.y - chevSize, -0.08);
        addLine(sp, chevL);
        addLine(sp, chevR);
        addLine(chevL, chevR);
      }

      return new THREE.BufferGeometry().setFromPoints(pts);
    };

    const whaleGeometry = createWhaleSkeletonLines();
    const whaleMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      linewidth: 1,
    });
    const whaleSkeleton = new THREE.LineSegments(whaleGeometry, whaleMaterial);
    whaleSkeleton.scale.set(0.55, 0.55, 0.55);
    whaleSkeleton.position.set(0.8, 0.8, -2.5);
    whaleSkeleton.rotation.y = -0.3;
    whaleSkeleton.rotation.x = 0.05;
    scene.add(whaleSkeleton);

    // 원형 파티클 효과 (Circle)
    const circleCount = 50;
    const circleGroup = new THREE.Group();

    // 원형 파티클 생성
    for (let i = 0; i < circleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1.5;
      const size = 0.02 + Math.random() * 0.04;

      const circleGeometry = new THREE.CircleGeometry(size, 16);
      const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4 + Math.random() * 0.3,
        side: THREE.DoubleSide,
      });

      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2 + 1.0, // 다이아몬드 위치에 맞춤
        Math.sin(angle) * radius
      );

      // 원이 항상 카메라를 향하도록 초기 회전
      circle.lookAt(camera.position);

      // 개별 애니메이션을 위한 사용자 데이터 저장
      circle.userData = {
        originalY: circle.position.y,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      };

      circleGroup.add(circle);
    }
    scene.add(circleGroup);

    // Animation
    let time = 0;
    function animate() {
      animationId = requestAnimationFrame(animate);
      time += 0.008;

      // 다이아몬드 천천히 회전
      diamond.rotation.y += 0.003;
      innerDiamond.rotation.y += 0.003;
      edgeLines.rotation.y += 0.003;
      blueprintEdgeLines.rotation.y -= 0.002; // 반대 방향으로 천천히 회전
      pavilionLines.rotation.y += 0.003; // 다이아몬드와 함께 회전

      // 조명 움직임 (반짝임 효과)
      light3.position.x = Math.sin(time * 2) * 2;
      light3.position.z = Math.cos(time * 1.5) * 2 + 2;
      light3.intensity = 2.5 + Math.sin(time * 3) * 1.0;

      pinkLight.intensity = 1.2 + Math.sin(time * 2.5) * 0.5;
      blueLight.intensity = 1.2 + Math.cos(time * 2) * 0.5;

      // 다이아몬드 자체 shimmer 효과
      diamondMaterial.envMapIntensity = 3.5 + Math.sin(time * 1.8) * 0.8;
      diamondMaterial.specularIntensity = 2.0 + Math.sin(time * 2.5 + 1.0) * 0.5;
      edgesMaterial.opacity = 0.4 + Math.sin(time * 2.0) * 0.15;

      // 고래 뼈 둥둥 뜨는 애니메이션
      whaleSkeleton.position.y = 0.8 + Math.sin(time * 0.4) * 0.25;
      whaleSkeleton.rotation.y = -0.3 + Math.sin(time * 0.15) * 0.08;
      whaleSkeleton.rotation.z = Math.sin(time * 0.25 + 1.0) * 0.02;
      whaleMaterial.opacity = 0.3 + Math.sin(time * 0.6) * 0.08;

      // 원형 파티클 애니메이션
      circleGroup.rotation.y += 0.002;
      circleGroup.children.forEach((circle) => {
        // 각 원이 카메라를 바라보도록 (Billboard 효과)
        circle.lookAt(camera.position);
        // 부드러운 위아래 움직임
        const userData = circle.userData;
        circle.position.y = userData.originalY + Math.sin(time * userData.speed + userData.phase) * 0.1;
        // 반짝임 효과
        circle.material.opacity = 0.3 + Math.sin(time * 3 + userData.phase) * 0.2;
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
    sceneRef.current = { renderer, handleResize, animationId: () => animationId, diamondGeometry, diamondMaterial, edgesGeometry, edgesMaterial, blueprintEdgesMaterial, pavilionLinesGeometry, pavilionLinesMaterial, innerMaterial, circleGroup, envGeometry, envMaterial, whaleGeometry, whaleMaterial };
    }); // end of import('three').then()

    return () => {
      disposed = true;
      const refs = sceneRef.current;
      if (refs && refs.renderer) {
        if (refs.animationId) cancelAnimationFrame(refs.animationId());
        window.removeEventListener('resize', refs.handleResize);
        refs.renderer.dispose();
        refs.diamondGeometry.dispose();
        refs.diamondMaterial.dispose();
        refs.edgesGeometry.dispose();
        refs.edgesMaterial.dispose();
        refs.blueprintEdgesMaterial.dispose();
        refs.pavilionLinesGeometry.dispose();
        refs.pavilionLinesMaterial.dispose();
        refs.innerMaterial.dispose();
        refs.circleGroup.children.forEach((circle) => {
          circle.geometry.dispose();
          circle.material.dispose();
        });
        refs.envGeometry.dispose();
        refs.envMaterial.dispose();
        refs.whaleGeometry.dispose();
        refs.whaleMaterial.dispose();
      }
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
