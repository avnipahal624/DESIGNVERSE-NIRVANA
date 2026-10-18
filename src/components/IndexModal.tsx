import { useEffect } from 'react';

interface IndexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IndexModal({ isOpen, onClose }: IndexModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const chapters = [
    {
      chap: 'CHAPTER 00',
      title: 'The Monumental Book',
      desc: '3D hardbound folio on basalt plinth with cascading oxblood silk ribbon.',
      href: '#hero',
    },
    {
      chap: 'CHAPTER 01',
      title: 'Kinetic Letterforms',
      desc: '11 responsive letterforms with WebGL fluid simulation & 3D inspection.',
      href: '#letterforms',
    },
    {
      chap: 'CHAPTER 02',
      title: 'The Curatorial Manifesto',
      desc: 'Eames India Report heritage & “Beyond the Silicon Loom” essay.',
      href: '#manifesto',
    },
    {
      chap: 'CHAPTER 03',
      title: 'The Graduation Atelier',
      desc: 'Industrial, Communication, Textile & New Media diploma monographs.',
      href: '#atelier',
    },
    {
      chap: 'CHAPTER 04',
      title: 'Academic Pillars & Tracks',
      desc: 'Disciplinary taxonomy: Tectonic, Semiotics, Computation, Civic.',
      href: '#tracks',
    },
    {
      chap: 'CHAPTER 05',
      title: 'Colloquium Programme',
      desc: '4-day convocation timetable, Sabarmati plinth review & nocturnal projections.',
      href: '#programme',
    },
    {
      chap: 'CHAPTER 06',
      title: 'Exhibition Pass Generator',
      desc: 'Engrave your verified accreditation badge with cryptographic seal.',
      href: '#pass',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0D0B0A]/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-12 overflow-y-auto"
      onClick={onClose}
    >
      <div className="flex justify-between items-center border-b border-[#8E8271]/20 pb-4 max-w-5xl mx-auto w-full">
        <span className="font-mono text-xs tracking-widest uppercase text-[#8E8271]">
          // PUBLICATION DIRECTORY INDEX
        </span>
        <button
          onClick={onClose}
          className="font-mono text-xs tracking-widest uppercase text-[#FAF8F5] hover:text-[#721724] border border-[#8E8271]/30 px-3 py-1 transition"
        >
          [ESC] CLOSE
        </button>
      </div>

      <div
        className="my-auto max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {chapters.map((c, i) => (
          <a
            key={i}
            href={c.href}
            onClick={onClose}
            className="group p-6 border border-[#8E8271]/20 hover:border-[#8A1829] hover:bg-[#1A1413] transition-all bg-[#120F0E]"
          >
            <span className="font-mono text-xs text-[#8A1829] block mb-2 font-bold">
              {c.chap}
            </span>
            <h3 className="font-display text-xl text-[#FAF8F5] group-hover:text-[#F5F2EB] transition-colors mb-2">
              {c.title}
            </h3>
            <p className="font-serif text-sm text-[#CFC2AC] leading-relaxed">
              {c.desc}
            </p>
          </a>
        ))}
      </div>

      <div className="border-t border-[#8E8271]/20 pt-4 flex justify-between items-center text-xs font-mono text-[#8E8271] uppercase tracking-widest max-w-5xl mx-auto w-full">
        <span>DESIGNVERSE © 2025 • INDIRA GANDHI DELHI TECHNOLOGICAL UNIVERSITY</span>
        <span className="hidden sm:inline">PRESS ESCAPE TO DISMISS</span>
      </div>
    </div>
  );
}
