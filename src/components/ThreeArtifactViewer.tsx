import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type LightingPreset = 'studio_noon' | 'gallery_dusk' | 'oxblood_neon';

interface ThreeArtifactViewerProps {
  wireframe: boolean;
  lightingPreset: LightingPreset;
  accentColor?: string;
  onResetTrigger?: number;
}

export function ThreeArtifactViewer({
  wireframe,
  lightingPreset,
  accentColor = '#8A1829',
  onResetTrigger = 0,
}: ThreeArtifactViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // References to mutable Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const solidMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const ribbonMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const ring2MatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const plinthWireMatRef = useRef<THREE.LineBasicMaterial | null>(null);

  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    key: THREE.DirectionalLight;
    fill: THREE.DirectionalLight;
    top: THREE.DirectionalLight;
  } | null>(null);

  const rotStateRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    targetRotX: 0.2,
    targetRotY: 0.4,
    currentRotX: 0.2,
    currentRotY: 0.4,
    autoRotate: true,
  });

  // 1. Initial Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.8, 2.2, 3.8);
    camera.lookAt(0, 0.2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.cursor = 'grab';

    // Clear previous children if any
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting rig
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    keyLight.position.set(4, 6, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x731421, 1.8);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const topRim = new THREE.DirectionalLight(0xb7aa96, 1.2);
    topRim.position.set(0, 5, -2);
    scene.add(topRim);

    lightsRef.current = {
      ambient: ambientLight,
      key: keyLight,
      fill: fillLight,
      top: topRim,
    };

    // Root group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const solidMats: THREE.MeshStandardMaterial[] = [];

    // Part 1: Raw Chiseled Stone Plinth
    const plinthGeo = new THREE.BoxGeometry(2.4, 0.22, 2.4);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x1f1d1b,
      roughness: 0.92,
      metalness: 0.1,
    });
    solidMats.push(plinthMat);
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -0.55;
    modelGroup.add(plinth);

    // Plinth wireframe accent rim
    const plinthWireMat = new THREE.LineBasicMaterial({
      color: 0x651d2b,
      transparent: true,
      opacity: 0.6,
    });
    plinthWireMatRef.current = plinthWireMat;
    const plinthWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(plinthGeo),
      plinthWireMat
    );
    plinthWire.position.copy(plinth.position);
    modelGroup.add(plinthWire);

    // Part 2: Brutalist Concrete Monolith Towers (Cantilevered volumes)
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0xb7aa96,
      roughness: 0.82,
      metalness: 0.05,
    });
    solidMats.push(towerMat);

    const tower1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.6, 0.8), towerMat);
    tower1.position.set(-0.45, 0.35, -0.2);
    modelGroup.add(tower1);

    const tower2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.1, 0.65), towerMat);
    tower2.position.set(0.4, 0.1, 0.25);
    modelGroup.add(tower2);

    // Horizontal beam linking monoliths
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0xe8e2d5,
      roughness: 0.75,
      metalness: 0.15,
    });
    solidMats.push(beamMat);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.28, 0.5), beamMat);
    beam.position.set(0.05, 0.95, -0.05);
    modelGroup.add(beam);

    // Part 3: Deep Oxblood Silk Ribbon & Specular Glass / Titanium Membrane
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.8, 1.15, -0.1),
      new THREE.Vector3(-0.2, 0.85, 0.45),
      new THREE.Vector3(0.3, 0.35, 0.65),
      new THREE.Vector3(0.8, -0.2, 0.8),
      new THREE.Vector3(1.1, -0.5, 1.1),
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 40, 0.035, 12, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      roughness: 0.35,
      metalness: 0.45,
      emissive: new THREE.Color(0x3d0710),
      emissiveIntensity: 0.4,
    });
    ribbonMatRef.current = ribbonMat;
    solidMats.push(ribbonMat);
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    modelGroup.add(ribbon);

    // Part 4: Kinetic Floating Coordinate Gyroscope / Titanium Rings
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf2ede3,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: true,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.012, 16, 64), ringMat);
    ring1.rotation.x = Math.PI / 3;
    modelGroup.add(ring1);

    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x731421, wireframe: true });
    ring2MatRef.current = ring2Mat;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.008, 16, 64), ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    modelGroup.add(ring2);

    // Part 5: Floating Dust / Spatial Particles around the artifact
    const particleCount = 45;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 3.2;
      pPos[i + 1] = (Math.random() - 0.2) * 2.5;
      pPos[i + 2] = (Math.random() - 0.5) * 3.2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf2ede3,
      size: 0.025,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(pGeo, pMat);
    modelGroup.add(particles);

    solidMaterialsRef.current = solidMats;

    // Pointer events for orbit controls
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      rotStateRef.current.isDragging = true;
      rotStateRef.current.autoRotate = false;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      rotStateRef.current.prevX = clientX;
      rotStateRef.current.prevY = clientY;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!rotStateRef.current.isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - rotStateRef.current.prevX;
      const deltaY = clientY - rotStateRef.current.prevY;
      rotStateRef.current.prevX = clientX;
      rotStateRef.current.prevY = clientY;

      rotStateRef.current.targetRotY += deltaX * 0.008;
      rotStateRef.current.targetRotX += deltaY * 0.008;
      rotStateRef.current.targetRotX = Math.max(-0.6, Math.min(0.8, rotStateRef.current.targetRotX));
    };

    const onPointerUp = () => {
      rotStateRef.current.isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    };

    const onDoubleClick = () => {
      rotStateRef.current.autoRotate = !rotStateRef.current.autoRotate;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    dom.addEventListener('dblclick', onDoubleClick);

    // Resize observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }

    // Animation loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (rotStateRef.current.autoRotate) {
        rotStateRef.current.targetRotY += 0.004;
      }

      // Smooth exponential damping
      rotStateRef.current.currentRotY +=
        (rotStateRef.current.targetRotY - rotStateRef.current.currentRotY) * 0.08;
      rotStateRef.current.currentRotX +=
        (rotStateRef.current.targetRotX - rotStateRef.current.currentRotX) * 0.08;

      modelGroup.rotation.y = rotStateRef.current.currentRotY;
      modelGroup.rotation.x = rotStateRef.current.currentRotX;

      ring1.rotation.z = elapsed * 0.15;
      ring2.rotation.x = elapsed * -0.2;
      particles.rotation.y = elapsed * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);

      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('dblclick', onDoubleClick);

      if (resizeObserver) resizeObserver.disconnect();
      renderer.dispose();
      plinthGeo.dispose();
      ribbonGeo.dispose();
      pGeo.dispose();
    };
  }, []);

  // 2. Wireframe mode sync
  useEffect(() => {
    solidMaterialsRef.current.forEach((mat) => {
      mat.wireframe = wireframe;
      if (wireframe) {
        mat.emissive = mat.emissive || new THREE.Color(0x000000);
      }
    });
  }, [wireframe]);

  // 3. Lighting Preset sync
  useEffect(() => {
    if (!lightsRef.current || !rendererRef.current) return;
    const { ambient, key, fill, top } = lightsRef.current;
    const renderer = rendererRef.current;

    switch (lightingPreset) {
      case 'studio_noon':
        ambient.color.setHex(0xffffff);
        ambient.intensity = 1.1;
        key.color.setHex(0xfffcf5);
        key.intensity = 2.8;
        key.position.set(3, 7, 3);
        fill.color.setHex(0xd8d4cc);
        fill.intensity = 1.2;
        top.color.setHex(0xffffff);
        top.intensity = 1.4;
        renderer.toneMappingExposure = 1.35;
        if (ribbonMatRef.current) ribbonMatRef.current.emissive.setHex(0x220508);
        if (ring2MatRef.current) ring2MatRef.current.color.setHex(0x731421);
        if (plinthWireMatRef.current) plinthWireMatRef.current.color.setHex(0x651d2b);
        break;

      case 'oxblood_neon':
        ambient.color.setHex(0x240308);
        ambient.intensity = 0.5;
        key.color.setHex(0xff1e46);
        key.intensity = 3.5;
        key.position.set(2, 4, 3);
        fill.color.setHex(0x9b0e27);
        fill.intensity = 3.2;
        top.color.setHex(0x00e5ff); // Cyber cyan accent counter-fill
        top.intensity = 1.6;
        renderer.toneMappingExposure = 1.4;
        if (ribbonMatRef.current) ribbonMatRef.current.emissive.setHex(0x730015);
        if (ring2MatRef.current) ring2MatRef.current.color.setHex(0xff2e56);
        if (plinthWireMatRef.current) plinthWireMatRef.current.color.setHex(0xff1e46);
        break;

      case 'gallery_dusk':
      default:
        ambient.color.setHex(0xd4c2b0);
        ambient.intensity = 0.65;
        key.color.setHex(0xffeedd);
        key.intensity = 2.2;
        key.position.set(4, 5, 2.5);
        fill.color.setHex(0x3d1421);
        fill.intensity = 1.6;
        top.color.setHex(0x8a7a68);
        top.intensity = 0.9;
        renderer.toneMappingExposure = 1.15;
        if (ribbonMatRef.current) ribbonMatRef.current.emissive.setHex(0x3d0710);
        if (ring2MatRef.current) ring2MatRef.current.color.setHex(0x9e2a3b);
        if (plinthWireMatRef.current) plinthWireMatRef.current.color.setHex(0x822637);
        break;
    }
  }, [lightingPreset]);

  // 4. Accent Color Sync
  useEffect(() => {
    if (ribbonMatRef.current) {
      ribbonMatRef.current.color.set(accentColor);
    }
  }, [accentColor]);

  // 5. Reset Camera Trigger
  useEffect(() => {
    if (onResetTrigger > 0) {
      rotStateRef.current.targetRotX = 0.2;
      rotStateRef.current.targetRotY = 0.4;
      rotStateRef.current.autoRotate = true;
    }
  }, [onResetTrigger]);

  return <div ref={mountRef} className="w-full h-full bg-transparent select-none" />;
}
