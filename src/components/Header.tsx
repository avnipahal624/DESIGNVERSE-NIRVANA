import { useState, useRef } from 'react';

interface HeaderProps {
  onOpenIndex: () => void;
  onOpenGame: () => void;
  onOpenAiStudio: () => void;
}

export function Header({ onOpenIndex, onOpenGame, onOpenAiStudio }: HeaderProps) {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleAudio = () => {
    if (!isAudioActive) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // Low A ambient fundamental
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime); // Subtle ambient drone

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        gainNodeRef.current = gainNode;
        setIsAudioActive(true);
      } catch (err) {
        console.warn('Audio Context restriction', err);
        setIsAudioActive(true);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
        setTimeout(() => {
          if (oscRef.current) {
            oscRef.current.stop();
            oscRef.current.disconnect();
          }
          setIsAudioActive(false);
        }, 150);
      } else {
        setIsAudioActive(false);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0D0B0A]/90 backdrop-blur-md border-b border-[#8E8271]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-mono text-xs tracking-wider">
        {/* Brand Zone */}
        <div className="flex items-center space-x-4">
          <a
            href="#hero"
            className="flex items-center space-x-2 text-[#F5F2EB] hover:text-[#721724] transition"
          >
            <span className="inline-block w-2.5 h-2.5 bg-[#8A1829] rounded-full animate-pulse" />
            <span className="font-display font-bold tracking-widest text-sm uppercase">
              IGDTUW • DESIGNVERSE
            </span>
          </a>
          <span className="hidden md:inline text-[#8E8271]/60">/</span>
          <span className="hidden md:inline text-[#8E8271] uppercase text-[10px] tracking-widest">
            VOL. XXVIII — ANTHOLOGY OF FORMS
          </span>
        </div>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center space-x-8 text-[11px] uppercase tracking-widest">
          <a href="#letterforms" className="text-[#E2D9C8] hover:text-white transition">
            01. Interactive Letterforms
          </a>
          <a href="#manifesto" className="text-[#E2D9C8] hover:text-white transition">
            02. Curatorial Note
          </a>
          <a href="#atelier" className="text-[#E2D9C8] hover:text-white transition">
            03. The Atelier
          </a>
          <a href="#tracks" className="text-[#E2D9C8] hover:text-white transition">
            04. Academic Tracks
          </a>
          <a href="#programme" className="text-[#E2D9C8] hover:text-white transition">
            05. Programme
          </a>
          <a href="#pass" className="text-[#E2D9C8] hover:text-white transition">
            06. Pass Generator
          </a>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenGame}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#8A1829] hover:bg-[#a82236] text-white border border-[#D4AF37] text-[10px] tracking-widest font-bold uppercase transition shadow-md"
            title="Launch full-viewport 3D Glyph Runner game"
          >
            <span>🎮</span>
            <span>3D GAME</span>
          </button>

          <button
            onClick={onOpenAiStudio}
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 bg-[#1F1A18] hover:bg-[#2C2420] text-[#D4AF37] border border-[#8E8271]/40 text-[10px] tracking-widest uppercase transition"
            title="Launch Multimodal AI Synthesis Suite"
          >
            <span>✨</span>
            <span>AI LAB</span>
          </button>

          <button
            onClick={toggleAudio}
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded border text-[10px] tracking-widest transition ${
              isAudioActive
                ? 'border-[#8A1829] text-[#721724] bg-[#4A0E17]/20 font-bold'
                : 'border-[#8E8271]/30 text-[#E2D9C8] hover:border-[#F5F2EB]'
            }`}
            title="Toggle synthesized 432Hz ambient drone sound"
          >
            <span className="material-symbols-outlined text-xs">
              {isAudioActive ? 'volume_up' : 'volume_mute'}
            </span>
            <span>{isAudioActive ? '432Hz' : 'SOUND'}</span>
          </button>

          <button
            onClick={onOpenIndex}
            className="p-1.5 px-2.5 text-[#F5F2EB] hover:text-[#B7AA96] font-mono text-[11px] tracking-wider border border-[#8E8271]/30 flex items-center gap-1.5 hover:bg-white/5 transition"
            aria-label="Open Directory Index"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A1829]" />
            <span>INDEX</span>
          </button>

          <a
            href="#pass"
            className="hidden lg:inline-block bg-[#4A0E17] hover:bg-[#8A1829] text-[#F5F2EB] px-3.5 py-1.5 text-[11px] font-mono tracking-widest uppercase border border-[#8E8271]/20 transition-all shadow-md"
          >
            Monograph
          </a>
        </div>
      </div>
    </header>
  );
}
