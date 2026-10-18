import { useState, useEffect, useRef } from 'react';

interface ChapterNode {
  id: string;
  chapterNumber: string;
  shortLabel: string;
  title: string;
}

const CHAPTERS: ChapterNode[] = [
  { id: 'hero', chapterNumber: '00', shortLabel: 'MONUMENT', title: 'The Monumental Folio' },
  { id: 'letterforms', chapterNumber: '01', shortLabel: 'GLYPHS', title: 'Dissecting the Glyphs' },
  { id: 'manifesto', chapterNumber: '02', shortLabel: 'NOTE', title: 'Curatorial Manifesto' },
  { id: 'atelier', chapterNumber: '03', shortLabel: 'ATELIER', title: 'The Graduation Atelier' },
  { id: 'tracks', chapterNumber: '04', shortLabel: 'PILLARS', title: 'Academic Pillars' },
  { id: 'programme', chapterNumber: '05', shortLabel: 'PROGRAMME', title: 'Colloquium Schedule' },
  { id: 'pass', chapterNumber: '06', shortLabel: 'PASS', title: 'Pass Engraving Engine' },
];

export function ChapterProgressRail() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = docHeight - viewportHeight;

      // 1. Calculate overall scroll percentage
      const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100)) : 0;
      setScrollProgress(progress);

      // 2. High-precision viewport collision testing
      // If user is at the very top of the page
      if (scrollY < 100) {
        setActiveChapterIndex(0);
        return;
      }

      // If user has scrolled to the bottom of the page
      if (scrollY + viewportHeight >= docHeight - 80) {
        setActiveChapterIndex(CHAPTERS.length - 1);
        return;
      }

      // Mid-viewport target line (where reader's eye is focused)
      const focusPoint = scrollY + viewportHeight * 0.38;

      let bestIndex = 0;
      let minDistanceToCenter = Infinity;

      for (let i = 0; i < CHAPTERS.length; i++) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const sectionTop = rect.top + scrollY;
          const sectionHeight = rect.height;
          const sectionBottom = sectionTop + sectionHeight;

          // Check if focus line falls directly within this section
          if (focusPoint >= sectionTop && focusPoint < sectionBottom) {
            bestIndex = i;
            break;
          }

          // Fallback: nearest section center
          const sectionCenter = sectionTop + sectionHeight / 2;
          const dist = Math.abs(focusPoint - sectionCenter);
          if (dist < minDistanceToCenter) {
            minDistanceToCenter = dist;
            bestIndex = i;
          }
        }
      }

      setActiveChapterIndex(bestIndex);
    };

    const onScroll = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial check
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  return (
    <nav
      aria-label="Monograph Chapter Progress Rail"
      className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-end select-none pointer-events-auto"
    >
      {/* Top Folio Header Indicator */}
      <div className="font-mono text-[9px] tracking-widest text-[#8E8271]/80 uppercase mb-3 text-right">
        <span className="block text-[8px] text-[#721724] font-bold">FOLIO // PROGRESS</span>
        <div className="flex items-center justify-end space-x-1.5">
          <span className="text-[#FAF8F5] tabular-nums font-bold text-[10px]">
            {Math.round(scrollProgress)}%
          </span>
          <span className="text-[#8E8271]/50">•</span>
          <span className="text-[#D4AF37] font-bold text-[9px]">
            CH.{activeChapter.chapterNumber}
          </span>
        </div>
        <div className="text-[8px] text-[#CFC2AC] truncate max-w-[120px] transition-all duration-200">
          {activeChapter.shortLabel}
        </div>
      </div>

      {/* The Main Vertical Rail Container */}
      <div className="relative flex flex-col items-center py-2">
        {/* Hairline Guide Track */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-[#8E8271]/25 right-[5px]" />

        {/* Dynamic Oxblood to Gilded Progress Fill Line */}
        <div
          className="absolute top-0 w-[2px] bg-gradient-to-b from-[#721724] via-[#8A1829] to-[#D4AF37] right-[4.5px] transition-all duration-150 rounded-full"
          style={{ height: `${scrollProgress}%` }}
        />

        {/* Chapter Nodes */}
        <div className="flex flex-col space-y-6 relative z-10">
          {CHAPTERS.map((chap, idx) => {
            const isActive = activeChapterIndex === idx;
            const isPassed = activeChapterIndex > idx;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={chap.id}
                className="relative flex items-center justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => scrollToChapter(chap.id)}
              >
                {/* Expandable Editorial Tooltip */}
                <div
                  className={`absolute right-7 py-1 px-2.5 bg-[#14100F] border border-[#8E8271]/40 font-mono text-[10px] tracking-wider text-right shadow-2xl transition-all duration-200 pointer-events-none whitespace-nowrap z-30 ${
                    isHovered
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-2'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#8A1829] font-bold">[CH.{chap.chapterNumber}]</span>
                    <span className="text-[#FAF8F5]">{chap.title}</span>
                  </div>
                </div>

                {/* Active Section Inline Marker Line */}
                {isActive && (
                  <div className="mr-2 h-[1px] w-3 bg-[#D4AF37] transition-all duration-300" />
                )}

                {/* Chapter Number Label */}
                <span
                  className={`font-mono text-[9px] tracking-widest mr-2 transition-all duration-200 ${
                    isActive
                      ? 'text-[#FAF8F5] font-bold scale-110'
                      : isPassed
                      ? 'text-[#CFC2AC]/80'
                      : 'text-[#8E8271]/45 hover:text-[#CFC2AC]'
                  }`}
                >
                  {chap.chapterNumber}
                </span>

                {/* Tactile Marker Dot / Notch */}
                <div
                  className={`w-2.5 h-2.5 rounded-none rotate-45 border transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? 'bg-[#8A1829] border-[#D4AF37] scale-125 shadow-[0_0_12px_rgba(212,175,55,0.7)]'
                      : isPassed
                      ? 'bg-[#30080E] border-[#8A1829]/70'
                      : 'bg-[#14100F] border-[#8E8271]/40 hover:border-[#FAF8F5]'
                  }`}
                >
                  {isActive && <div className="w-1 h-1 bg-[#D4AF37] rounded-none" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Subtext */}
      <div className="mt-3 font-mono text-[8px] text-[#8E8271]/60 tracking-tighter text-right">
        [INDEX RAIL]
      </div>
    </nav>
  );
}
