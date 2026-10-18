import { useEffect, useRef, useState } from 'react';
import { LETTER_ARTIFACTS } from '../data/artifacts';
import { FluidCanvas } from './FluidCanvas';

interface KineticLetterformsProps {
  onSelectGlyph: (index: number) => void;
}

export function KineticLetterforms({ onSelectGlyph }: KineticLetterformsProps) {
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  const [velocityDisplay, setVelocityDisplay] = useState('00.0 px/s');
  const [activeNodes, setActiveNodes] = useState(0);
  const [mouseCoords, setMouseCoords] = useState('X: 00 | Y: 00');

  const letterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // Physical state tracking per letter
    const letterStates = letterRefs.current.map((el, i) => ({
      el,
      char: LETTER_ARTIFACTS[i]?.letter || '',
      currentX: 0,
      currentY: 0,
      currentRotX: 0,
      currentRotY: 0,
      currentScale: 1,
      targetX: 0,
      targetY: 0,
      targetRotX: 0,
      targetRotY: 0,
      targetScale: 1,
      proximityNorm: 0,
    }));

    let pointer = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      velocity: 0,
      lastTime: performance.now(),
      active: false,
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const now = performance.now();
      const dt = Math.max(1, now - pointer.lastTime);
      if (pointer.prevX !== -9999) {
        const dist = Math.hypot(clientX - pointer.prevX, clientY - pointer.prevY);
        const instantVel = (dist / dt) * 1000;
        pointer.velocity = pointer.velocity * 0.8 + instantVel * 0.2;
      }
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x = clientX;
      pointer.y = clientY;
      pointer.lastTime = now;
      pointer.active = true;

      setMouseCoords(`X: ${Math.round(clientX).toString().padStart(4, '0')} | Y: ${Math.round(clientY).toString().padStart(4, '0')}`);
    };

    const onMouseMove = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    let animId: number;
    const animateRipple = () => {
      const PROXIMITY_RADIUS = 220;
      let nodes = 0;

      letterStates.forEach((state) => {
        if (!state.el) return;
        const rect = state.el.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;

        const dx = pointer.x - letterCenterX;
        const dy = pointer.y - letterCenterY;
        const distance = Math.hypot(dx, dy);

        if (pointer.active && distance < PROXIMITY_RADIUS && distance > 0) {
          nodes++;
          const normDist = (PROXIMITY_RADIUS - distance) / PROXIMITY_RADIUS;
          const easeNorm = Math.pow(normDist, 1.6);

          const angle = Math.atan2(dy, dx);
          const pushForce = -easeNorm * 36;
          state.targetX = Math.cos(angle) * pushForce;
          state.targetY = Math.sin(angle) * pushForce * 0.85;

          state.targetRotX = (-dy / PROXIMITY_RADIUS) * 22 * easeNorm;
          state.targetRotY = (dx / PROXIMITY_RADIUS) * 28 * easeNorm;
          state.targetScale = 1 + easeNorm * 0.14;
          state.proximityNorm = easeNorm;
        } else {
          state.targetX = 0;
          state.targetY = 0;
          state.targetRotX = 0;
          state.targetRotY = 0;
          state.targetScale = 1;
          state.proximityNorm = 0;
        }

        const lerpFactor = 0.12;
        state.currentX += (state.targetX - state.currentX) * lerpFactor;
        state.currentY += (state.targetY - state.currentY) * lerpFactor;
        state.currentRotX += (state.targetRotX - state.currentRotX) * lerpFactor;
        state.currentRotY += (state.targetRotY - state.currentRotY) * lerpFactor;
        state.currentScale += (state.targetScale - state.currentScale) * lerpFactor;

        const p = state.proximityNorm;
        const redOffset = (-3 * p).toFixed(1);
        const silverOffset = (3 * p).toFixed(1);

        state.el.style.transform = `translate3d(${state.currentX.toFixed(2)}px, ${state.currentY.toFixed(2)}px, 0px) rotateX(${state.currentRotX.toFixed(2)}deg) rotateY(${state.currentRotY.toFixed(2)}deg) scale(${state.currentScale.toFixed(3)})`;

        if (p > 0.02) {
          state.el.style.textShadow = `${redOffset}px 0 rgba(138,24,41,${(0.35 + p * 0.65).toFixed(2)}), ${silverOffset}px 0 rgba(183,170,150,0.4), 0 14px 28px rgba(74,14,23,${(p * 0.5).toFixed(2)})`;
        } else {
          state.el.style.textShadow = 'none';
        }
      });

      setActiveNodes(nodes);
      const vel = Math.min(999.9, pointer.velocity).toFixed(1).padStart(4, '0');
      setVelocityDisplay(`${vel} px/s`);
      if (nodes === 0) {
        pointer.velocity *= 0.94;
      }

      animId = requestAnimationFrame(animateRipple);
    };

    animId = requestAnimationFrame(animateRipple);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <section
      id="letterforms"
      className="relative py-28 px-4 md:px-8 border-b border-[#8E8271]/20 bg-[#100D0C] overflow-hidden"
    >
      {/* Background WebGL Fluid Canvas with Curl Noise */}
      <FluidCanvas className="absolute inset-0 w-full h-full pointer-events-none opacity-45 mix-blend-screen" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#8E8271]/20 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#8A1829] font-mono text-xs uppercase tracking-widest mb-2">
              <span>[SECTION 01]</span>
              <span>•</span>
              <span>KINETIC TYPOGRAPHY &amp; ARTIFACT DIRECTORY</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tight text-[#F5F2EB]">
              DISSECTING{' '}
              <span className="font-serif italic font-normal text-[#721724]">
                THE GLYPHS
              </span>
            </h2>
          </div>
          <div className="text-left md:text-right font-mono text-xs text-[#8E8271] max-w-sm space-y-1">
            <p className="tracking-wider">
              Hover over each letter to disperse harmonic waves. Click any glyph to launch its high-resolution 3D artifact chamber.
            </p>
            <div className="text-[10px] text-[#CFC2AC]">
              VELOCITY: <span className="text-[#F5F2EB]">{velocityDisplay}</span> //{' '}
              <span className={activeNodes > 0 ? 'text-[#8A1829] animate-pulse font-bold' : ''}>
                {activeNodes > 0 ? `DISPLACEMENT: ACTIVE (${activeNodes} NODES)` : 'DISPLACEMENT: STANDBY'}
              </span>
            </div>
          </div>
        </div>

        {/* 11 Interactive Glyphs Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2 md:gap-3 my-8 select-none">
          {LETTER_ARTIFACTS.map((artifact, idx) => {
            const fontClasses = [
              'font-display font-black',
              'font-serif font-bold italic',
              'font-display font-light',
              'font-mono font-bold',
              'font-serif font-black',
              'font-display font-medium',
              'font-serif italic',
              'font-display font-bold',
              'font-serif font-black',
              'font-display font-normal',
              'font-serif italic font-bold',
            ][idx % 11];

            return (
              <button
                key={idx}
                ref={(el) => {
                  letterRefs.current[idx] = el;
                }}
                onClick={() => onSelectGlyph(idx)}
                onMouseEnter={() => setHoveredLetter(artifact.letter)}
                onMouseLeave={() => setHoveredLetter(null)}
                className="group aspect-[3/4] bg-[#161211] border border-[#8E8271]/20 p-3 flex flex-col justify-between items-center hover:border-[#8A1829] hover:bg-[#1E1716] transition text-center focus:outline-none focus:ring-1 focus:ring-[#8A1829] relative overflow-hidden"
                style={{ willChange: 'transform' }}
                title={`Inspect Glyph [${artifact.letter}] — ${artifact.title}`}
              >
                <span className="font-mono text-[9px] text-[#8E8271] group-hover:text-[#8A1829]">
                  {artifact.plateCode.split('/')[0].trim()}
                </span>
                <span
                  className={`text-5xl md:text-7xl ${fontClasses} text-[#F5F2EB] group-hover:text-[#8A1829] transition-colors`}
                >
                  {artifact.letter}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-tighter text-[#CFC2AC] group-hover:text-white">
                  {artifact.category.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Telemetry Footer */}
        <div className="mt-8 p-4 bg-[#14100F] border border-[#8E8271]/20 flex flex-wrap items-center justify-between font-mono text-xs text-[#8E8271] gap-2">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>FLUID TYPOGRAPHIC MEMBRANE ACTIVE</span>
            <span className="hidden sm:inline text-[#CFC2AC]/40">|</span>
            <span className="hidden sm:inline">WebGL Shaders Synced @ 60 FPS</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{mouseCoords}</span>
            <span className="text-[11px] text-[#721724] uppercase font-bold">
              {hoveredLetter ? `HOVERED GLYPH: [${hoveredLetter}]` : 'SELECT ANY GLYPH TO INSPECT ARTIFACT'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
