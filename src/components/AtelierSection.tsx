import { useState } from 'react';
import { ATELIER_PROJECTS, AtelierProject } from '../data/artifacts';

interface AtelierSectionProps {
  onInspectGlyph: (glyphIndex: number) => void;
}

export function AtelierSection({ onInspectGlyph }: AtelierSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProjects = activeCategory === 'all'
    ? ATELIER_PROJECTS
    : ATELIER_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="atelier" className="py-24 bg-[#0F0C0B] border-b border-[#8E8271]/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#8A1829]">
              [CHAPTER 03 // ARCHIVE]
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[#FAF8F5] uppercase mt-2">
              The Graduation Atelier
            </h2>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 border transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#4A0E17] text-white border-[#8A1829] font-bold'
                  : 'bg-black/40 text-[#E2D9C8] border-[#8E8271]/20 hover:border-[#FAF8F5]'
              }`}
            >
              ALL WORKS
            </button>
            <button
              onClick={() => setActiveCategory('industrial')}
              className={`px-3 py-1.5 border transition-all ${
                activeCategory === 'industrial'
                  ? 'bg-[#4A0E17] text-white border-[#8A1829] font-bold'
                  : 'bg-black/40 text-[#E2D9C8] border-[#8E8271]/20 hover:border-[#FAF8F5]'
              }`}
            >
              INDUSTRIAL
            </button>
            <button
              onClick={() => setActiveCategory('communication')}
              className={`px-3 py-1.5 border transition-all ${
                activeCategory === 'communication'
                  ? 'bg-[#4A0E17] text-white border-[#8A1829] font-bold'
                  : 'bg-black/40 text-[#E2D9C8] border-[#8E8271]/20 hover:border-[#FAF8F5]'
              }`}
            >
              COMMUNICATION
            </button>
            <button
              onClick={() => setActiveCategory('textile')}
              className={`px-3 py-1.5 border transition-all ${
                activeCategory === 'textile'
                  ? 'bg-[#4A0E17] text-white border-[#8A1829] font-bold'
                  : 'bg-black/40 text-[#E2D9C8] border-[#8E8271]/20 hover:border-[#FAF8F5]'
              }`}
            >
              TEXTILE &amp; BIO
            </button>
            <button
              onClick={() => setActiveCategory('spatial')}
              className={`px-3 py-1.5 border transition-all ${
                activeCategory === 'spatial'
                  ? 'bg-[#4A0E17] text-white border-[#8A1829] font-bold'
                  : 'bg-black/40 text-[#E2D9C8] border-[#8E8271]/20 hover:border-[#FAF8F5]'
              }`}
            >
              INTERACTION
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: AtelierProject) => (
            <article
              key={project.id}
              className="group bg-[#161211] border border-[#8E8271]/20 hover:border-[#8A1829] transition duration-300 flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex justify-between items-center font-mono text-[10px] text-[#8E8271] mb-4 pb-2 border-b border-[#8E8271]/15">
                  <span className="text-[#8A1829] font-bold">{project.catalogNo}</span>
                  <span>{project.degree}</span>
                </div>
                <h3 className="font-display text-xl text-[#FAF8F5] group-hover:text-[#721724] transition mb-2">
                  {project.title}
                </h3>
                <p className="font-serif text-sm text-[#E2D9C8] mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="bg-black/50 p-4 border border-[#8E8271]/15 font-mono text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#8E8271]">Candidate:</span>
                    <span className="text-[#EDE7DC]">{project.candidate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8271]">Advisors:</span>
                    <span className="text-[#EDE7DC]">{project.advisors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8271]">{project.attributeLabel}:</span>
                    <span className="text-[#EDE7DC]">{project.attributeValue}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#110E0D] border-t border-[#8E8271]/15 flex justify-between items-center font-mono text-xs">
                <button
                  type="button"
                  onClick={() => onInspectGlyph(project.associatedGlyphIndex)}
                  className="text-[#721724] hover:text-white uppercase tracking-wider flex items-center space-x-1.5 transition font-bold"
                >
                  <span>Inspect 3D Geometry</span>
                  <span className="material-symbols-outlined text-sm">visibility</span>
                </button>
                <span className="text-[#8E8271] text-[10px]">{project.campus}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#programme"
            className="inline-flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-[#E2D9C8] hover:text-[#721724] transition border-b border-[#8E8271]/40 pb-1"
          >
            <span>VIEW FULL JURY ARCHIVE OF 184 GRADUATION MONOGRAPHS</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
}
