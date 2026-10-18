import { useState, useEffect, useRef } from 'react';

export function HeroBook() {
  const [isOpened, setIsOpened] = useState(false);
  const bookContainerRef = useRef<HTMLDivElement | null>(null);
  const bookElementRef = useRef<HTMLDivElement | null>(null);

  // Parallax tilt on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bookElementRef.current || isOpened) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      const rotateY = x * 7;
      const rotateX = -y * 5;
      bookElementRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpened]);

  const toggleBook = () => {
    setIsOpened(!isOpened);
    if (bookElementRef.current) {
      bookElementRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-16 flex flex-col justify-center items-center px-4 overflow-hidden bg-grid-ruled border-b border-[#8E8271]/20 light-shaft"
    >
      {/* Ambient background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#4A0E17]/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#2E0B11]/35 rounded-full blur-[160px] pointer-events-none" />

      {/* Editorial Header Metadata */}
      <div className="w-full max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#8E8271]/20 pb-4 text-xs font-mono text-[#8E8271] gap-3">
        <div>
          <span className="text-[#8A1829] font-bold">[FOLIO 001]</span> INDIRA GANDHI DELHI TECHNOLOGICAL UNIVERSITY
          <div className="text-[10px] uppercase tracking-widest text-[#CFC2AC]">
            Kashmere Gate Heritage Campus • New Delhi
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span>EXHIBITION TIMEFRAME: OCT 24–26, 2025</span>
          <div className="text-[10px] text-[#721724] tracking-widest uppercase">
            Coordinates: 28.6657° N, 77.2323° E
          </div>
        </div>
      </div>

      {/* 3D Folio Book Assembly Stage */}
      <div
        ref={bookContainerRef}
        className="perspective-book w-full max-w-4xl py-6 flex items-center justify-center relative z-10"
      >
        <div
          ref={bookElementRef}
          onClick={toggleBook}
          className={`book-container relative w-full aspect-[16/10] max-w-3xl rounded-r-lg shadow-2xl flex cursor-pointer group transition-all duration-700 ${
            isOpened ? 'book-opened' : ''
          }`}
        >
          {/* Raw Chiselled Stone Plinth Base beneath the book */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[104%] h-12 bg-gradient-to-b from-[#2e2b27] to-[#141210] border-t border-[#8E8271]/30 shadow-2xl rounded-sm flex items-center justify-between px-6 pointer-events-none z-0">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#8E8271]/80">
              SPEC: ARCHITECTURAL PLINTH // 1800KG BASALT
            </span>
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#8E8271]/80">
              FOLIO 00 // HARDBOUND EDITION
            </span>
          </div>

          {/* Book Spine simulated depth */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1c0407] via-[#35080f] to-[#1c0407] rounded-l-sm shadow-[-15px_0_35px_-5px_rgba(0,0,0,0.7)] z-30 flex flex-col justify-between items-center py-6 border-r border-[#61121d]">
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#CFC2AC] rotate-90 origin-center whitespace-nowrap">
              IGDTUW GRADUATION '25
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#8E8271] rotate-90 origin-center whitespace-nowrap">
              DESIGNVERSE
            </span>
          </div>

          {/* Left Cover / Opening Leaf flap */}
          <div
            className="book-cover-left absolute inset-0 bg-[#30080E] border-2 border-[#54111c] z-20 shadow-2xl flex flex-col justify-between p-8 md:p-12 pl-14 overflow-hidden"
          >
            {/* Master Photo of Monolithic Art-Book on Plinth */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBchn5SYhsWD1iqFzeSab-wMsK9-vzdIdGCalBiEAp7u_m9lsFuBcDuRxjbesgGd0km4B8Nwykr4YhaqAqwTMpLBFT3ZtEd0Bo6VeyVa7EmNmCKucn4iEkML7KcU3iR3ax8QjI6A_W_qVWMOoWGTO13GE4b_Z7Qyxhm4T7BxCR70OyWwZ0RobntHRLJrcVHp4HwB70_Wqyv2e4WRCqr9jTuqZF2ZJI1hzq5fCtLdu65naRSZ7gBySlm"
              alt="Sculptural Art-Book on stone plinth"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity brightness-75 group-hover:scale-105 transition-transform duration-1000"
            />

            {/* Live Oxblood Silk Ribbon Ribbon over plinth */}
            <div className="absolute top-0 right-1/4 w-12 h-[125%] bg-gradient-to-b from-[#45121C] via-[#651D2B] to-[#45121C] shadow-2xl pointer-events-none z-30 flex flex-col justify-end items-center pb-4 border-x border-[#8A1829]/40">
              <span className="font-mono text-[8px] tracking-widest text-white/70 uppercase rotate-90 whitespace-nowrap mb-6">
                NIRVANA // DESIGNVERSE
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]/80" />
            </div>

            {/* Gilded corner ornaments */}
            <div className="absolute top-4 right-4 text-[#D4AF37] text-xs font-display z-10">
              ✦ 1961 — 2025
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-[#8E8271] uppercase tracking-widest z-10">
              Hardbound First Edition
            </div>

            <div className="space-y-2 relative z-10">
              <span className="px-2 py-0.5 bg-[#721724]/40 border border-[#8A1829] text-[#EDE7DC] text-[10px] font-mono uppercase tracking-widest inline-block">
                Graduation Monograph &amp; Exhibition
              </span>
              <p className="font-mono text-xs text-[#8E8271] tracking-wider">
                ANNUAL CONVOCATION EDITION
              </p>
            </div>

            <div className="my-auto space-y-4 relative z-10">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-[#FAF8F5] uppercase leading-none">
                DESIGN<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F2EB] via-[#E2D9C8] to-[#721724] italic font-serif">
                  VERSE
                </span>
              </h1>
              <div className="h-0.5 w-24 bg-[#D4AF37]" />
              <p className="font-serif italic text-lg md:text-xl text-[#EDE7DC] max-w-md">
                "The synthesis of tectonic rigor, ancestral craft, and computational synthetic realities."
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#8E8271]/20 text-xs font-mono text-[#E2D9C8] relative z-10">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{isOpened ? 'CLICK TO CLOSE FOLIO' : 'CLICK COVER TO UNVEIL INSIDE'}</span>
              </span>
              <span className="text-[#D4AF37] font-mono">
                {isOpened ? '[CLICK TO RETRACT ⟳]' : '[CLICK TO UNCLASP ⟳]'}
              </span>
            </div>
          </div>

          {/* Inside Right Page (Revealed upon opening) */}
          <div className="w-full h-full bg-[#1A1614] border-2 border-[#8E8271]/30 p-8 md:p-12 pl-14 flex flex-col justify-between z-10 text-[#EDE7DC]">
            <div className="flex justify-between items-start border-b border-[#8E8271]/20 pb-4">
              <div>
                <span className="font-mono text-[10px] text-[#721724] tracking-widest uppercase">
                  PROLOGUE &amp; FOLIO DIRECTORY
                </span>
                <h2 className="text-2xl font-display uppercase tracking-wide text-[#F5F2EB]">
                  Genesis of the Metaverse
                </h2>
              </div>
              <span className="font-mono text-xs text-[#8E8271]">PAGE 03</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 font-serif text-sm md:text-base leading-relaxed text-[#E2D9C8]">
              <p>
                In our sixty-fourth year of design pedagogy, Designverse 2025 dismantles the binary between the tangible artifact and dynamic synthetic realms. Here lies the collective culmination of 420 graduating scholars across industrial design, textile futures, speculative communication, and spatial architecture.
              </p>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-black/40 border-l-2 border-[#8A1829]">
                  <span className="text-white block font-bold">14 DISCIPLINARY DOMAINS</span>
                  <span className="text-[#8E8271] text-[11px]">
                    Industrial, Communication, Textile, Film, Interaction &amp; New Media.
                  </span>
                </div>
                <div className="p-3 bg-black/40 border-l-2 border-[#D4AF37]">
                  <span className="text-white block font-bold">PHYSICAL &amp; DIGITAL PAVILIONS</span>
                  <span className="text-[#8E8271] text-[11px]">
                    Simultaneous hybrid exhibition live in Ahmedabad and WebGL metaverse.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#8E8271]/20">
              <a
                href="#letterforms"
                onClick={(e) => e.stopPropagation()}
                className="px-5 py-2.5 bg-[#4A0E17] hover:bg-[#8A1829] text-white font-mono text-xs tracking-widest uppercase transition flex items-center space-x-2 shadow-lg"
              >
                <span>EXPLORE INTERACTIVE LETTERFORMS</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </a>
              <span className="font-mono text-[11px] text-[#8E8271]">
                CURATED BY NIRVANA SOCIETY, IGDTUW
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction Subtext */}
      <p className="mt-8 text-xs font-mono text-[#8E8271] uppercase tracking-widest text-center">
        Interactive Catalog Folio • Touch cover to inspect interior spreads
      </p>
    </section>
  );
}
