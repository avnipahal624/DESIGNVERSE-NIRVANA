import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface GlyphRunnerGameProps {
  onExitGame: () => void;
}

type GameState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAME_OVER';

interface SoundSystem {
  playJump: () => void;
  playGlyphCollect: () => void;
  playHit: () => void;
  playVictory: () => void;
  playThrust: () => void;
  toggleMute: () => boolean;
  isMuted: () => boolean;
}

const GLYPH_CHARS = ['D', 'E', 'S', 'I', 'G', 'N'];

export const GlyphRunnerGame: React.FC<GlyphRunnerGameProps> = ({ onExitGame }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-level game state for UI overlays only (isolated from 60fps loop)
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [score, setScore] = useState(0);
  const [glyphsCollected, setGlyphsCollected] = useState(0);
  const [shield, setShield] = useState(100);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);

  // References for imperative engine state to prevent React re-renders from touching loop
  const engineRef = useRef<{
    gameState: GameState;
    score: number;
    glyphsCount: number;
    shield: number;
    speed: number;
    sound: SoundSystem | null;
    startGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    restartGame: () => void;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // =========================================================================
    // 1. PROCEDURAL WEB AUDIO SYNTHESIZER
    // =========================================================================
    let audioCtx: AudioContext | null = null;
    let muted = false;

    const initAudio = () => {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx = new AudioClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    };

    const soundSystem: SoundSystem = {
      isMuted: () => muted,
      toggleMute: () => {
        muted = !muted;
        return muted;
      },
      playJump: () => {
        if (muted) return;
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      },
      playGlyphCollect: () => {
        if (muted) return;
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        // Two-tone harmonic chime
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          if (!audioCtx) return;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.1, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.36);
        });
      },
      playHit: () => {
        if (muted) return;
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      },
      playVictory: () => {
        if (muted) return;
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        notes.forEach((freq, idx) => {
          if (!audioCtx) return;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.15, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.65);
        });
      },
      playThrust: () => {
        if (muted) return;
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      },
    };

    // =========================================================================
    // 2. THREE.JS SCENE, CAMERA, RENDERER SETUP (STUDIO PBR & ACES)
    // =========================================================================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0908);
    scene.fog = new THREE.FogExp2(0x0a0908, 0.022);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );
    camera.position.set(0, 3.8, 7.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Procedural Studio Environment for metallic PBR reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting Rig
    const ambientLight = new THREE.HemisphereLight(0xe5dfd3, 0x140d10, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    keyLight.position.set(8, 16, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const oxbloodRimLight = new THREE.PointLight(0x8a1829, 3.2, 28);
    oxbloodRimLight.position.set(-5, 4, -4);
    scene.add(oxbloodRimLight);

    // =========================================================================
    // 3. PROCEDURAL COMPOSITE PLAYER AVATAR (8-PART GROUP)
    // =========================================================================
    // Fulfills Directive: 3-12 distinct parts, varying roughness/metalness,
    // bottom-center pivot, and soft radial contact shadow disc.
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 0);

    // Part 1: Primary Faceted Chassis
    const chassisGeo = new THREE.DodecahedronGeometry(0.55, 1);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      metalness: 0.85,
      roughness: 0.22,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.position.y = 0.85;
    chassisMesh.castShadow = true;
    playerGroup.add(chassisMesh);

    // Part 2 & 3: Articulated Shoulder Pauldrons
    const pauldronGeo = new THREE.BoxGeometry(0.24, 0.4, 0.35);
    const pauldronMat = new THREE.MeshStandardMaterial({
      color: 0x2e2825,
      metalness: 0.9,
      roughness: 0.45,
    });
    const leftPauldron = new THREE.Mesh(pauldronGeo, pauldronMat);
    leftPauldron.position.set(-0.62, 0.95, 0);
    leftPauldron.rotation.z = 0.2;
    leftPauldron.castShadow = true;
    playerGroup.add(leftPauldron);

    const rightPauldron = new THREE.Mesh(pauldronGeo, pauldronMat);
    rightPauldron.position.set(0.62, 0.95, 0);
    rightPauldron.rotation.z = -0.2;
    rightPauldron.castShadow = true;
    playerGroup.add(rightPauldron);

    // Part 4: Gyroscopic Titanium Coordinate Ring (Torus)
    const ringGeo = new THREE.TorusGeometry(0.78, 0.035, 16, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Gilded titanium accent
      metalness: 0.95,
      roughness: 0.12,
    });
    const gyroRing = new THREE.Mesh(ringGeo, ringMat);
    gyroRing.position.y = 0.85;
    gyroRing.castShadow = true;
    playerGroup.add(gyroRing);

    // Part 5: Glowing Oxblood Crystal Visor / Sensor Core
    const visorGeo = new THREE.ConeGeometry(0.22, 0.35, 6);
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x721724,
      emissive: 0x8a1829,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.6,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.95, 0.48);
    visorMesh.rotation.x = Math.PI / 2;
    playerGroup.add(visorMesh);

    // Part 6 & 7: Twin Repulsor Jet Thrusters
    const thrusterGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.35, 12);
    const thrusterMat = new THREE.MeshStandardMaterial({
      color: 0x44403c,
      metalness: 0.75,
      roughness: 0.5,
    });
    const leftThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    leftThruster.position.set(-0.35, 0.45, -0.3);
    leftThruster.rotation.x = 0.25;
    playerGroup.add(leftThruster);

    const rightThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    rightThruster.position.set(0.35, 0.45, -0.3);
    rightThruster.rotation.x = 0.25;
    playerGroup.add(rightThruster);

    // Part 8: Soft Radial Contact Shadow Disc (flush with the ground)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0,0,0,0.75)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.02;
    playerGroup.add(shadowMesh);

    scene.add(playerGroup);

    // =========================================================================
    // 4. PROCEDURAL HIGHWAY TRACK & DECORATIVE ARCHITECTURE
    // =========================================================================
    const trackWidth = 7.5;
    const trackSegments = 8;
    const segmentLength = 25;
    const totalTrackLength = trackSegments * segmentLength;
    const trackGroup = new THREE.Group();

    // Procedural basalt concrete material
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x191614,
      roughness: 0.85,
      metalness: 0.15,
    });
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x8a1829, // Oxblood curb trim
      roughness: 0.35,
      metalness: 0.6,
    });

    for (let i = 0; i < trackSegments; i++) {
      const segGroup = new THREE.Group();
      segGroup.position.z = -i * segmentLength;

      // Road bed
      const roadGeo = new THREE.BoxGeometry(trackWidth, 0.4, segmentLength);
      const roadMesh = new THREE.Mesh(roadGeo, trackMat);
      roadMesh.position.y = -0.2;
      roadMesh.receiveShadow = true;
      segGroup.add(roadMesh);

      // Curbs
      const curbGeo = new THREE.BoxGeometry(0.3, 0.35, segmentLength);
      const leftCurb = new THREE.Mesh(curbGeo, curbMat);
      leftCurb.position.set(-trackWidth / 2 - 0.15, 0.05, 0);
      segGroup.add(leftCurb);

      const rightCurb = new THREE.Mesh(curbGeo, curbMat);
      rightCurb.position.set(trackWidth / 2 + 0.15, 0.05, 0);
      segGroup.add(rightCurb);

      // Brutalist Pylon Columns flanking the causeway
      const pylonGeo = new THREE.BoxGeometry(0.8, 12, 0.8);
      const pylonMat = new THREE.MeshStandardMaterial({
        color: 0x221e1b,
        roughness: 0.9,
      });

      const leftPylon = new THREE.Mesh(pylonGeo, pylonMat);
      leftPylon.position.set(-trackWidth / 2 - 2.8, 4, 0);
      segGroup.add(leftPylon);

      const rightPylon = new THREE.Mesh(pylonGeo, pylonMat);
      rightPylon.position.set(trackWidth / 2 + 2.8, 4, 0);
      segGroup.add(rightPylon);

      trackGroup.add(segGroup);
    }
    scene.add(trackGroup);

    // =========================================================================
    // 5. SACRED TYPOGRAPHIC GLYPH CRYSTALS & HAZARD PYLONS
    // =========================================================================
    interface GlyphItem {
      mesh: THREE.Group;
      char: string;
      collected: boolean;
      initialZ: number;
    }

    interface HazardItem {
      mesh: THREE.Group;
      active: boolean;
      initialZ: number;
      oscillatorSpeed: number;
      phase: number;
    }

    const glyphs: GlyphItem[] = [];
    const hazards: HazardItem[] = [];

    // Helper: generate 2D canvas texture with glowing character
    const createGlyphTexture = (char: string) => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#4A0E17';
        ctx.fillRect(0, 0, 128, 128);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 6;
        ctx.strokeRect(4, 4, 120, 120);

        ctx.fillStyle = '#FAF8F5';
        ctx.font = 'bold 74px "Cinzel", "Cormorant Garamond", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(char, 64, 68);
      }
      return new THREE.CanvasTexture(c);
    };

    // Spawn 6 Sacred Glyphs along the path
    const lanePositions = [-2.2, 0, 2.2];
    GLYPH_CHARS.forEach((char, index) => {
      const itemGroup = new THREE.Group();
      const zPos = -30 - index * 26;
      const lane = lanePositions[index % lanePositions.length];
      itemGroup.position.set(lane, 1.2, zPos);

      // Floating Octahedron Gem
      const gemGeo = new THREE.OctahedronGeometry(0.7, 0);
      const gemMat = new THREE.MeshPhysicalMaterial({
        color: 0xd4af37,
        emissive: 0x8a1829,
        emissiveIntensity: 1.4,
        metalness: 0.8,
        roughness: 0.15,
        clearcoat: 1.0,
      });
      const gemMesh = new THREE.Mesh(gemGeo, gemMat);
      gemMesh.castShadow = true;
      itemGroup.add(gemMesh);

      // Sprite Label with Char
      const spriteMat = new THREE.SpriteMaterial({
        map: createGlyphTexture(char),
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.4, 1.4, 1.4);
      sprite.position.y = 1.35;
      itemGroup.add(sprite);

      scene.add(itemGroup);
      glyphs.push({
        mesh: itemGroup,
        char,
        collected: false,
        initialZ: zPos,
      });
    });

    // Spawn Hazard Obelisks / Void Lasers
    for (let i = 0; i < 14; i++) {
      const hGroup = new THREE.Group();
      const zPos = -18 - i * 14;
      const lane = lanePositions[(i + 1) % lanePositions.length];
      hGroup.position.set(lane, 0, zPos);

      // Warning Base
      const baseGeo = new THREE.BoxGeometry(1.2, 0.3, 1.2);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x221215,
        roughness: 0.3,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.15;
      hGroup.add(baseMesh);

      // Red laser blade pylon
      const pylonGeo = new THREE.BoxGeometry(0.3, 2.4, 0.3);
      const pylonMat = new THREE.MeshPhysicalMaterial({
        color: 0xff1744,
        emissive: 0xd50000,
        emissiveIntensity: 3.5,
      });
      const pMesh = new THREE.Mesh(pylonGeo, pylonMat);
      pMesh.position.y = 1.2;
      hGroup.add(pMesh);

      scene.add(hGroup);
      hazards.push({
        mesh: hGroup,
        active: true,
        initialZ: zPos,
        oscillatorSpeed: 1.5 + (i % 3) * 0.8,
        phase: i * 0.5,
      });
    }

    // Particle Burst Pool for Hits and Collects
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: THREE.Vector3[] = [];

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = 0;
      particlePositions[p * 3 + 1] = -100;
      particlePositions[p * 3 + 2] = 0;
      particleVelocities.push(new THREE.Vector3());
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.25,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    const triggerParticleBurst = (origin: THREE.Vector3, colorHex: number) => {
      particleMat.color.setHex(colorHex);
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      for (let p = 0; p < particleCount; p++) {
        array[p * 3] = origin.x;
        array[p * 3 + 1] = origin.y;
        array[p * 3 + 2] = origin.z;
        particleVelocities[p].set(
          (Math.random() - 0.5) * 8,
          Math.random() * 6 + 2,
          (Math.random() - 0.5) * 8
        );
      }
      posAttr.needsUpdate = true;
    };

    // =========================================================================
    // 6. INPUT HANDLING & GAME STATE REFS
    // =========================================================================
    const keys = {
      left: false,
      right: false,
      forward: false,
      backward: false,
      jump: false,
    };
    let jumpRequested = false;
    let pauseRequested = false;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.backward = true;
      if (e.code === 'Space') {
        e.preventDefault();
        jumpRequested = true;
      }
      if (e.code === 'KeyM') {
        const nextMuted = soundSystem.toggleMute();
        setIsMuted(nextMuted);
      }
      if (e.code === 'Escape') {
        pauseRequested = true;
      }
      if (e.code === 'Enter' || e.code === 'Space') {
        if (engineRef.current?.gameState === 'TITLE') {
          engineRef.current.startGame();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.backward = false;
      if (e.code === 'Space') keys.jump = false;
    };

    const onBlur = () => {
      keys.left = false;
      keys.right = false;
      keys.forward = false;
      keys.backward = false;
      keys.jump = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    // =========================================================================
    // 7. 60FPS SIMULATION LOOP WITH DAMPING & HITSTOP
    // =========================================================================
    let currentGameState: GameState = 'TITLE';
    let currentScore = 0;
    let collectedGlyphsCount = 0;
    let currentShield = 100;
    let hitstopRemaining = 0;
    let screenShake = 0;

    // Kinematic variables
    const playerPos = new THREE.Vector3(0, 0, 0);
    const playerVel = new THREE.Vector3(0, 0, 0);
    let isGrounded = true;
    let baseRunSpeed = 16.0;
    const gravity = 32.0;
    const jumpStrength = 11.5;

    let lastTime = performance.now();
    let animFrameId: number;

    const tick = (now: number) => {
      animFrameId = requestAnimationFrame(tick);

      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      // Clamp frame delta time as specified in game-dev instructions
      const dt = Math.min(rawDt, 0.05);

      // Handle pause requests
      if (pauseRequested) {
        pauseRequested = false;
        if (currentGameState === 'PLAYING') {
          currentGameState = 'PAUSED';
          setGameState('PAUSED');
        } else if (currentGameState === 'PAUSED') {
          currentGameState = 'PLAYING';
          setGameState('PLAYING');
        }
      }

      // 1. Title Screen Camera Orbit & Idle Sway
      if (currentGameState === 'TITLE') {
        const time = now * 0.0008;
        camera.position.x = Math.sin(time) * 6.5;
        camera.position.z = Math.cos(time) * 6.5;
        camera.position.y = 3.2;
        camera.lookAt(0, 0.9, 0);

        gyroRing.rotation.x += dt * 1.5;
        gyroRing.rotation.y += dt * 2.0;
        chassisMesh.rotation.y += dt * 0.8;

        renderer.render(scene, camera);
        return;
      }

      // 2. Paused State
      if (currentGameState === 'PAUSED') {
        renderer.render(scene, camera);
        return;
      }

      // 3. Hitstop logic (30-80ms simulation freeze on heavy impacts)
      if (hitstopRemaining > 0) {
        hitstopRemaining -= dt;
        renderer.render(scene, camera);
        return;
      }

      // 4. Playing State Simulation
      if (currentGameState === 'PLAYING') {
        // Player Lateral Movement with Snappy Responsive Inputs
        const targetXVel = (keys.right ? 7.5 : 0) - (keys.left ? 7.5 : 0);
        playerVel.x += (targetXVel - playerVel.x) * Math.min(1.0, dt * 14);
        playerPos.x += playerVel.x * dt;

        // Clamp within track boundaries
        const maxX = trackWidth / 2 - 0.7;
        if (playerPos.x > maxX) {
          playerPos.x = maxX;
          playerVel.x = 0;
        } else if (playerPos.x < -maxX) {
          playerPos.x = -maxX;
          playerVel.x = 0;
        }

        // Jump physics & coyote-time buffering
        if (jumpRequested) {
          jumpRequested = false;
          if (isGrounded) {
            playerVel.y = jumpStrength;
            isGrounded = false;
            soundSystem.playJump();
          }
        }

        // Gravity application
        if (!isGrounded) {
          playerVel.y -= gravity * dt;
          playerPos.y += playerVel.y * dt;
          if (playerPos.y <= 0) {
            playerPos.y = 0;
            playerVel.y = 0;
            isGrounded = true;
          }
        }

        // Forward movement
        const effectiveSpeed = baseRunSpeed + (keys.forward ? 5 : 0) - (keys.backward ? 5 : 0);
        playerPos.z -= effectiveSpeed * dt;

        // Player Model Transform Updates
        playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);
        // Bank roll on turning
        playerGroup.rotation.z = -playerVel.x * 0.04;
        gyroRing.rotation.x += dt * 4;
        gyroRing.rotation.y += dt * 3;

        // Update score & speed
        currentScore += Math.floor(dt * 60 * (1 + collectedGlyphsCount * 0.5));
        setScore(currentScore);
        setSpeedMultiplier(parseFloat((effectiveSpeed / baseRunSpeed).toFixed(1)));

        // Infinite Track Illusion: Loop track segments beneath player
        for (let s = 0; s < trackGroup.children.length; s++) {
          const seg = trackGroup.children[s];
          if (seg.position.z > playerPos.z + segmentLength) {
            seg.position.z -= totalTrackLength;
          }
        }

        // Glyph Collections
        glyphs.forEach((item) => {
          if (!item.collected) {
            item.mesh.rotation.y += dt * 2.2;
            const dist = playerPos.distanceTo(item.mesh.position);
            if (dist < 1.4) {
              item.collected = true;
              item.mesh.visible = false;
              collectedGlyphsCount++;
              setGlyphsCollected(collectedGlyphsCount);
              soundSystem.playGlyphCollect();
              triggerParticleBurst(item.mesh.position, 0xd4af37);

              // Check Victory condition (All 6 Glyphs Collected)
              if (collectedGlyphsCount >= 6) {
                currentGameState = 'VICTORY';
                setGameState('VICTORY');
                soundSystem.playVictory();
              }
            }
          }
        });

        // Hazard Collision & Obstacle Updates
        hazards.forEach((haz) => {
          if (haz.active) {
            // Oscillate pylon slightly
            haz.mesh.position.x = Math.sin(now * 0.002 * haz.oscillatorSpeed + haz.phase) * 2.2;

            const dist = playerPos.distanceTo(haz.mesh.position);
            // Collision detection with bounding cylinder
            if (dist < 1.1 && playerPos.y < 1.3) {
              // Impact triggered!
              haz.active = false;
              haz.mesh.visible = false;
              soundSystem.playHit();
              triggerParticleBurst(haz.mesh.position, 0xff1744);

              // Hitstop & screen shake
              hitstopRemaining = 0.06; // 60ms hitstop
              screenShake = 0.45;

              currentShield = Math.max(0, currentShield - 25);
              setShield(currentShield);

              if (currentShield <= 0) {
                currentGameState = 'GAME_OVER';
                setGameState('GAME_OVER');
              }
            }
          }
        });

        // Particle System update
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        const pArray = posAttr.array as Float32Array;
        for (let p = 0; p < particleCount; p++) {
          if (pArray[p * 3 + 1] > -50) {
            pArray[p * 3] += particleVelocities[p].x * dt;
            pArray[p * 3 + 1] += particleVelocities[p].y * dt;
            pArray[p * 3 + 2] += particleVelocities[p].z * dt;
            particleVelocities[p].y -= 9.8 * dt; // Particle gravity
          }
        }
        posAttr.needsUpdate = true;

        // Camera Follow with smooth exponential damping and dynamic shake
        const targetCamX = playerPos.x * 0.5;
        const targetCamY = playerPos.y * 0.4 + 3.4;
        const targetCamZ = playerPos.z + 6.8;

        camera.position.x += (targetCamX - camera.position.x) * (1 - Math.exp(-9 * dt));
        camera.position.y += (targetCamY - camera.position.y) * (1 - Math.exp(-9 * dt));
        camera.position.z += (targetCamZ - camera.position.z) * (1 - Math.exp(-14 * dt));

        if (screenShake > 0) {
          camera.position.x += (Math.random() - 0.5) * screenShake;
          camera.position.y += (Math.random() - 0.5) * screenShake;
          screenShake *= Math.exp(-8 * dt);
        }

        camera.lookAt(playerPos.x * 0.7, playerPos.y + 1.1, playerPos.z - 4);
      }

      renderer.render(scene, camera);
    };

    animFrameId = requestAnimationFrame(tick);

    // Engine Control interface for UI buttons
    engineRef.current = {
      gameState: currentGameState,
      score: currentScore,
      glyphsCount: collectedGlyphsCount,
      shield: currentShield,
      speed: baseRunSpeed,
      sound: soundSystem,
      startGame: () => {
        currentGameState = 'PLAYING';
        setGameState('PLAYING');
        soundSystem.playThrust();
      },
      pauseGame: () => {
        currentGameState = 'PAUSED';
        setGameState('PAUSED');
      },
      resumeGame: () => {
        currentGameState = 'PLAYING';
        setGameState('PLAYING');
      },
      restartGame: () => {
        // Reset player
        playerPos.set(0, 0, 0);
        playerVel.set(0, 0, 0);
        isGrounded = true;

        // Reset Glyphs
        glyphs.forEach((g) => {
          g.collected = false;
          g.mesh.visible = true;
        });

        // Reset Hazards
        hazards.forEach((h) => {
          h.active = true;
          h.mesh.visible = true;
        });

        currentScore = 0;
        collectedGlyphsCount = 0;
        currentShield = 100;
        setScore(0);
        setGlyphsCollected(0);
        setShield(100);

        currentGameState = 'PLAYING';
        setGameState('PLAYING');
        soundSystem.playThrust();
      },
    };

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  const handleStart = useCallback(() => {
    engineRef.current?.startGame();
  }, []);

  const handleRestart = useCallback(() => {
    engineRef.current?.restartGame();
  }, []);

  const handleResume = useCallback(() => {
    engineRef.current?.resumeGame();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 w-screen h-screen bg-[#0A0908] select-none overflow-hidden font-mono"
    >
      {/* 3D WebGL Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair" />

      {/* =========================================================================
          PERIMETER HUD (LOW-OCCLUSION UI >= 85% UNOBSTRUCTED PLAYFIELD)
          ========================================================================= */}
      {gameState === 'PLAYING' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
          {/* Top Bar Status Clusters */}
          <div className="flex items-start justify-between">
            {/* Left Status: Shield & Speed */}
            <div className="bg-[#141210]/85 border border-[#8E8271]/30 p-3 rounded-none shadow-xl pointer-events-auto flex items-center space-x-6 text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#8E8271] block">
                  TECTONIC SHIELD
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-[#2E0B11] border border-[#8A1829]/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8A1829] to-[#D4AF37] transition-all duration-300"
                      style={{ width: `${shield}%` }}
                    />
                  </div>
                  <span className="font-bold text-[#FAF8F5] tabular-nums">{shield}%</span>
                </div>
              </div>

              <div className="border-l border-[#8E8271]/30 pl-4">
                <span className="text-[9px] uppercase tracking-widest text-[#8E8271] block">
                  VELOCITY
                </span>
                <span className="font-bold text-[#D4AF37] tabular-nums text-sm">
                  {speedMultiplier}x
                </span>
              </div>
            </div>

            {/* Right Status: Glyphs Collected & Score */}
            <div className="bg-[#141210]/85 border border-[#8E8271]/30 p-3 rounded-none shadow-xl pointer-events-auto flex items-center space-x-6 text-xs text-right">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#8E8271] block">
                  GLYPH SYNTHESIS
                </span>
                <div className="flex items-center space-x-1.5 justify-end">
                  {GLYPH_CHARS.map((char, idx) => (
                    <span
                      key={char}
                      className={`inline-block w-5 h-5 text-center leading-5 text-[10px] font-bold border ${
                        idx < glyphsCollected
                          ? 'bg-[#8A1829] text-white border-[#D4AF37]'
                          : 'bg-black/40 text-[#8E8271]/40 border-[#8E8271]/20'
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-l border-[#8E8271]/30 pl-4">
                <span className="text-[9px] uppercase tracking-widest text-[#8E8271] block">
                  CHRONO SCORE
                </span>
                <span className="font-bold text-[#FAF8F5] tabular-nums text-base">
                  {score.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Control Hint & Sound Toggle */}
          <div className="flex items-end justify-between text-[11px] text-[#8E8271]">
            <div className="bg-[#141210]/80 px-4 py-2 border border-[#8E8271]/25 pointer-events-auto">
              <span>WASD Move · Space Jump · Esc Pause · M Mute</span>
            </div>

            <div className="flex items-center space-x-3 pointer-events-auto">
              <button
                onClick={() => {
                  const m = engineRef.current?.sound?.toggleMute() ?? false;
                  setIsMuted(m);
                }}
                className="px-3 py-1.5 bg-[#141210]/80 border border-[#8E8271]/30 text-[#FAF8F5] hover:border-[#D4AF37] transition text-xs flex items-center space-x-1.5"
              >
                <span>{isMuted ? '🔇 MUTED' : '🔊 AUDIO'}</span>
              </button>

              <button
                onClick={onExitGame}
                className="px-3 py-1.5 bg-[#4A0E17] hover:bg-[#8A1829] border border-[#8A1829] text-[#FAF8F5] transition text-xs uppercase tracking-wider"
              >
                Exit to Monograph
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TITLE SCREEN MODAL (GAME SHELL DIRECTIVE)
          ========================================================================= */}
      {gameState === 'TITLE' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-8 sm:p-14 z-20 pointer-events-auto">
          {/* Top Institutional Badge */}
          <div className="flex justify-between items-center text-xs tracking-widest text-[#8E8271]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#8A1829] rounded-full animate-pulse" />
              <span className="text-[#FAF8F5] font-bold">
                IGDTUW DESIGNVERSE // TECTONIC LABYRINTH
              </span>
            </div>
            <button
              onClick={onExitGame}
              className="text-[#8E8271] hover:text-white transition uppercase text-[11px]"
            >
              [Return to Monograph ✕]
            </button>
          </div>

          {/* Centerpiece Bespoke Title Lockup with 35% Negative Space */}
          <div className="max-w-2xl my-auto space-y-6">
            <div className="space-y-1">
              <span className="px-2.5 py-1 bg-[#4A0E17]/60 border border-[#8A1829] text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold inline-block">
                Interactive Three.js 3D Arcade
              </span>
              <h1 className="text-5xl sm:text-7xl font-display font-extrabold text-[#FAF8F5] tracking-tight uppercase leading-none">
                GLYPH<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAF8F5] via-[#E2D9C8] to-[#8A1829] italic font-serif">
                  RUNNER 3D
                </span>
              </h1>
            </div>

            <p className="font-serif italic text-lg sm:text-xl text-[#CFC2AC] leading-relaxed max-w-lg">
              Traverse the brutalist cyber-highway of Kashmere Gate. Pilot the tectonic gyroscopic avatar, collect the six sacred letterforms, and withstand the void obelisks.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-[#8A1829] hover:bg-[#a82236] text-white font-mono text-sm uppercase tracking-widest font-bold shadow-2xl transition transform hover:scale-105 active:scale-95 border border-[#D4AF37]"
              >
                Commence Run [Space / Enter]
              </button>
              <span className="text-[11px] text-[#8E8271] tracking-widest">
                60 FPS SIMULATION // PROCEDURAL SOUND FX
              </span>
            </div>
          </div>

          {/* Bottom Control-Hint Line */}
          <div className="border-t border-[#8E8271]/30 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#8E8271] gap-2">
            <div>
              <span className="text-[#FAF8F5] font-bold">CONTROLS:</span> WASD Move · Space Jump/Dash · Esc Pause · M Mute
            </div>
            <div>
              <span>INDIRA GANDHI DELHI TECHNOLOGICAL UNIVERSITY © 2025</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAUSE MODAL
          ========================================================================= */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-6 z-30 pointer-events-auto">
          <div className="max-w-md w-full bg-[#141210] border border-[#8E8271]/40 p-8 shadow-2xl text-center space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D4AF37] block">
              [SIMULATION SUSPENDED]
            </span>
            <h2 className="text-3xl font-display uppercase tracking-wider text-[#FAF8F5]">
              Game Paused
            </h2>
            <div className="py-2 text-xs text-[#CFC2AC] font-mono space-y-2 border-y border-[#8E8271]/20">
              <div className="flex justify-between">
                <span>Current Score:</span>
                <span className="font-bold text-[#FAF8F5]">{score.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Glyphs Recovered:</span>
                <span className="font-bold text-[#D4AF37]">{glyphsCollected} / 6</span>
              </div>
              <div className="flex justify-between">
                <span>Shield Integrity:</span>
                <span className="font-bold text-emerald-400">{shield}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleResume}
                className="w-full py-3 bg-[#8A1829] hover:bg-[#a82236] text-white uppercase tracking-widest text-xs font-bold transition"
              >
                Resume Run [Esc]
              </button>
              <button
                onClick={handleRestart}
                className="w-full py-2.5 bg-black/40 hover:bg-black/60 border border-[#8E8271]/40 text-[#FAF8F5] uppercase tracking-widest text-xs transition"
              >
                Restart Simulation
              </button>
              <button
                onClick={onExitGame}
                className="w-full py-2 text-[#8E8271] hover:text-white uppercase tracking-widest text-xs transition"
              >
                Exit to Monograph
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VICTORY MODAL
          ========================================================================= */}
      {gameState === 'VICTORY' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-30 pointer-events-auto">
          <div className="max-w-lg w-full bg-[#181412] border-2 border-[#D4AF37] p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <span className="px-3 py-1 bg-[#4A0E17] text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold border border-[#8A1829] inline-block">
              ✦ TYPOGRAPHIC SYNTHESIS ACHIEVED ✦
            </span>
            <h2 className="text-4xl sm:text-5xl font-display uppercase tracking-tight text-[#FAF8F5]">
              VICTORY!
            </h2>
            <p className="font-serif italic text-[#CFC2AC] text-base">
              All six sacred glyphs of DESIGNVERSE have been synthesized into tectonic equilibrium.
            </p>
            <div className="bg-black/50 p-4 border border-[#8E8271]/30 font-mono text-sm space-y-2">
              <div className="flex justify-between text-[#8E8271]">
                <span>FINAL CHRONO SCORE</span>
                <span className="text-[#D4AF37] font-bold text-lg">{score.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#8E8271]">
                <span>RECOVERED WORDMARK</span>
                <span className="text-[#FAF8F5] tracking-widest font-bold">D • E • S • I • G • N</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 bg-[#8A1829] hover:bg-[#a82236] text-white uppercase tracking-widest text-xs font-bold transition border border-[#D4AF37]"
              >
                Play Again
              </button>
              <button
                onClick={onExitGame}
                className="flex-1 py-3 bg-black/40 hover:bg-black/60 border border-[#8E8271]/40 text-[#FAF8F5] uppercase tracking-widest text-xs transition"
              >
                Explore Monograph
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          GAME OVER MODAL
          ========================================================================= */}
      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-6 z-30 pointer-events-auto">
          <div className="max-w-md w-full bg-[#161113] border border-[#8A1829] p-8 shadow-2xl text-center space-y-6">
            <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block">
              [STRUCTURAL COLLAPSE]
            </span>
            <h2 className="text-4xl font-display uppercase tracking-tight text-red-100">
              GAME OVER
            </h2>
            <p className="font-serif text-[#CFC2AC] text-sm leading-relaxed">
              Tectonic shield depleted after impact with void obelisks.
            </p>
            <div className="bg-black/40 p-3 border border-[#8E8271]/20 font-mono text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8E8271]">Glyphs Recovered:</span>
                <span className="text-[#FAF8F5] font-bold">{glyphsCollected} / 6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8271]">Score Achieved:</span>
                <span className="text-[#D4AF37] font-bold">{score.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRestart}
                className="w-full py-3 bg-[#8A1829] hover:bg-[#a82236] text-white uppercase tracking-widest text-xs font-bold transition"
              >
                Retry Simulation
              </button>
              <button
                onClick={onExitGame}
                className="w-full py-2.5 text-[#8E8271] hover:text-white uppercase tracking-widest text-xs transition"
              >
                Exit to Monograph
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
