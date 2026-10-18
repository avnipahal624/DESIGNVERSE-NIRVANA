import { useState, useEffect } from 'react';
import { LETTER_ARTIFACTS } from '../data/artifacts';
import { ThreeArtifactViewer, LightingPreset } from './ThreeArtifactViewer';

interface ArtifactModalProps {
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function ArtifactModal({ selectedIndex, onClose, onNavigate }: ArtifactModalProps) {
  const [wireframe, setWireframe] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('gallery_dusk');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<number>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isOpen = selectedIndex !== null;
  const artifact = selectedIndex !== null ? LETTER_ARTIFACTS[selectedIndex] : null;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && selectedIndex !== null) {
        onNavigate((selectedIndex + 1) % LETTER_ARTIFACTS.length);
      } else if (e.key === 'ArrowLeft' && selectedIndex !== null) {
        onNavigate((selectedIndex - 1 + LETTER_ARTIFACTS.length) % LETTER_ARTIFACTS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, onClose, onNavigate]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !artifact || selectedIndex === null) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const toggleBookmark = () => {
    const nextSet = new Set(bookmarkedSet);
    if (nextSet.has(selectedIndex)) {
      nextSet.delete(selectedIndex);
      showToast(`Artifact [${artifact.letter}] removed from session binder.`);
    } else {
      nextSet.add(selectedIndex);
      showToast(`Artifact [${artifact.letter}] bookmarked to session portfolio.`);
    }
    setBookmarkedSet(nextSet);
  };

  const isBookmarked = bookmarkedSet.has(selectedIndex);

  const presetLabels: Record<LightingPreset, string> = {
    studio_noon: 'STUDIO NOON',
    gallery_dusk: 'GALLERY DUSK',
    oxblood_neon: 'OXBLOOD NEON',
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#14100F] border-2 border-[#8A1829] w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex justify-between items-center p-4 bg-[#1B1413] border-b border-[#8E8271]/20 font-mono text-xs">
          <div className="flex items-center space-x-3">
            <span
              className="w-7 h-7 flex items-center justify-center font-display font-bold text-white text-base shadow-inner"
              style={{ backgroundColor: artifact.accentColor }}
            >
              {artifact.letter}
            </span>
            <div>
              <span className="text-[10px] text-[#721724] uppercase tracking-widest block font-bold">
                {artifact.plateCode}
              </span>
              <span className="text-sm font-sans font-bold text-[#FAF8F5]">
                {artifact.title}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-[#8E8271] text-[10px] hidden md:inline">
              PLATE {(selectedIndex + 1).toString().padStart(2, '0')} / 11
            </span>
            <div className="flex items-center border border-[#8E8271]/30">
              <button
                onClick={() =>
                  onNavigate((selectedIndex - 1 + LETTER_ARTIFACTS.length) % LETTER_ARTIFACTS.length)
                }
                className="px-2.5 py-1 text-[#EDE7DC] hover:text-white hover:bg-[#201817] transition border-r border-[#8E8271]/30"
                title="Previous glyph (Left Arrow)"
              >
                ←
              </button>
              <button
                onClick={() => onNavigate((selectedIndex + 1) % LETTER_ARTIFACTS.length)}
                className="px-2.5 py-1 text-[#EDE7DC] hover:text-white hover:bg-[#201817] transition"
                title="Next glyph (Right Arrow)"
              >
                →
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-[#8E8271] hover:text-white p-1 hover:bg-[#4A0E17]/50 transition flex items-center gap-1 border border-[#8E8271]/30 px-2 py-0.5 text-[10px]"
              aria-label="Close Inspector"
            >
              <span>ESC</span>
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        {/* 3D Viewport Area */}
        <div className="relative w-full h-72 sm:h-96 bg-gradient-to-b from-[#0a0707] to-[#161010] flex items-center justify-center overflow-hidden">
          <ThreeArtifactViewer
            wireframe={wireframe}
            lightingPreset={lightingPreset}
            accentColor={artifact.accentColor}
            onResetTrigger={resetTrigger}
          />

          {/* Viewport Top-Left HUD */}
          <div className="absolute top-4 left-4 z-20 font-mono text-[10px] text-[#CFC2AC] bg-black/70 px-3 py-1.5 border border-[#8E8271]/20 backdrop-blur-sm pointer-events-none">
            <span>● LIVE 3D ORBITAL VIEW [LIGHT: {presetLabels[lightingPreset]}] // WIREFRAME: {wireframe ? 'ON' : 'OFF'}</span>
          </div>

          {/* Viewport Bottom-Right Controls Toolbar */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-wrap items-center gap-2">
            {/* Lighting Preset Segmented Switcher */}
            <div className="flex items-center bg-black/80 border border-[#8E8271]/40 p-0.5 font-mono text-[10px] backdrop-blur-sm">
              <span className="text-[#8E8271] px-2 py-1 uppercase text-[9px] tracking-wider select-none">
                LIGHT:
              </span>
              <button
                type="button"
                onClick={() => setLightingPreset('studio_noon')}
                className={`px-2 py-0.5 transition-all ${
                  lightingPreset === 'studio_noon'
                    ? 'text-white bg-[#721724] font-bold'
                    : 'text-[#CFC2AC] hover:text-white'
                }`}
              >
                NOON
              </button>
              <button
                type="button"
                onClick={() => setLightingPreset('gallery_dusk')}
                className={`px-2 py-0.5 transition-all ${
                  lightingPreset === 'gallery_dusk'
                    ? 'text-white bg-[#721724] font-bold'
                    : 'text-[#CFC2AC] hover:text-white'
                }`}
              >
                DUSK
              </button>
              <button
                type="button"
                onClick={() => setLightingPreset('oxblood_neon')}
                className={`px-2 py-0.5 transition-all ${
                  lightingPreset === 'oxblood_neon'
                    ? 'text-white bg-[#721724] font-bold'
                    : 'text-[#CFC2AC] hover:text-white'
                }`}
              >
                NEON
              </button>
            </div>

            {/* Wireframe Mode Toggle */}
            <button
              type="button"
              onClick={() => setWireframe(!wireframe)}
              className={`font-mono text-[10px] border px-3 py-1.5 backdrop-blur-sm transition-all flex items-center space-x-1.5 ${
                wireframe
                  ? 'border-[#8A1829] text-[#721724] bg-[#4A0E17]/40 font-bold'
                  : 'border-[#8E8271]/40 text-[#EDE7DC] bg-black/80 hover:bg-[#4A0E17]'
              }`}
            >
              <span>☵</span>
              <span>WIREFRAME: {wireframe ? 'ON' : 'OFF'}</span>
            </button>

            {/* Reset Camera button */}
            <button
              type="button"
              onClick={() => setResetTrigger((prev) => prev + 1)}
              className="font-mono text-[10px] bg-black/80 hover:bg-[#201817] border border-[#8E8271]/40 text-[#EDE7DC] px-3 py-1.5 backdrop-blur-sm transition"
              title="Reset camera tilt and rotation"
            >
              [⟲ RESET AXIS]
            </button>
          </div>
        </div>

        {/* Modal Bottom Information Area */}
        <div className="p-6 bg-[#161110] border-t border-[#8E8271]/20 font-sans space-y-4 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-[#8E8271]/15 pb-2 gap-2">
            <div>
              <span className="font-mono text-xs text-[#721724] font-bold block">
                {artifact.author}
              </span>
              <span className="text-xs text-[#8E8271] font-mono">
                {artifact.dept} • {artifact.campus}
              </span>
            </div>
            <div className="font-mono text-[10px] text-[#CFC2AC] uppercase tracking-wider text-left sm:text-right">
              <span>{artifact.year}</span>
              <div className="text-[#8A1829] font-bold">{artifact.scale}</div>
            </div>
          </div>

          <p className="font-serif text-base text-[#EDE7DC] leading-relaxed">
            {artifact.abstract}
          </p>

          {/* Materiality Spec */}
          <div className="p-3 bg-black/40 border border-[#8E8271]/20 font-mono text-xs space-y-1">
            <span className="text-[10px] text-[#721724] uppercase tracking-wider font-bold block">
              MATERIALITY MANIFEST:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[#CFC2AC]">
              {artifact.materials.map((m, i) => (
                <div key={i}>{m}</div>
              ))}
            </div>
          </div>

          {/* Faculty Critique */}
          <div className="p-3 bg-[#1A1413] border-l-2 border-[#8A1829] font-serif italic text-xs text-[#CFC2AC]">
            {artifact.critique}
          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#8E8271]/20 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleBookmark}
                className={`px-3 py-1.5 border text-xs tracking-wider uppercase transition flex items-center gap-1.5 ${
                  isBookmarked
                    ? 'border-[#8A1829] text-[#721724] bg-[#4A0E17]/20 font-bold'
                    : 'border-[#8E8271]/30 text-[#EDE7DC] hover:border-white'
                }`}
              >
                <span>{isBookmarked ? '★' : '☆'}</span>
                <span>{isBookmarked ? 'BOOKMARKED' : 'BOOKMARK ARTIFACT'}</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('Process schematics archived to session binder.')}
                className="px-3 py-1.5 border border-[#8E8271]/30 text-[#EDE7DC] hover:border-white uppercase text-xs tracking-wider transition"
              >
                VIEW SCHEMATICS
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#4A0E17] hover:bg-[#8A1829] text-white uppercase tracking-wider text-xs transition"
            >
              RETURN TO MONOGRAPH
            </button>
          </div>

          {/* Notification Toast */}
          {toastMessage && (
            <div className="p-2 bg-[#721724] text-white font-mono text-xs text-center border border-[#8A1829] animate-fadeIn">
              // {toastMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
