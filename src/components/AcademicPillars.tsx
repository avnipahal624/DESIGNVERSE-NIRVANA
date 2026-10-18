import { useState } from 'react';

interface AcademicPillarsProps {
  onInspectTrack?: (trackName: string) => void;
}

export function AcademicPillars({ onInspectTrack }: AcademicPillarsProps) {
  const [activeModalTrack, setActiveModalTrack] = useState<{
    title: string;
    location: string;
    description: string;
    capacity: string;
  } | null>(null);

  const tracks = [
    {
      num: '01',
      tag: 'SPRINT TRACK // INTENSIVE LAB',
      title: 'The 24h Design Sprints',
      description: 'A continuous creative endurance exercise. Interdisciplinary student teams tackle high-stakes design challenges across spatial design, UI systems, and speculative futures with live mentors.',
      capacity: '120 SEATS',
      location: 'LAB BLOCK B // INNOVATION WING',
    },
    {
      num: '02',
      tag: 'PROTOTYPING // HARDWARE & BIO-DESIGN',
      title: 'The Build Lab',
      description: 'Hands-on fabrication zone equipped with 3D print farms, CNC milling, paper crafting, and kinetic electronics. Convert digital wireframes into functional kinetic hardware.',
      capacity: 'FULL FABLAB',
      location: 'DESIGN WORKSHOP 04',
    },
    {
      num: '03',
      tag: 'CRITIQUE // DEBATE ARENA',
      title: 'The Idea Arena',
      description: 'A 360-degree amphitheater for provocative micro-talks, controversial design debates, and portfolio critiques from visiting global creative directors.',
      capacity: 'LIVE CRITIQUE',
      location: 'CENTRAL AMPHITHEATRE',
    },
    {
      num: '04',
      tag: 'GALLERY // IMMERSIVE INSTALLATION',
      title: 'Curated Exhibitions',
      description: 'A darkened museum gallery presenting the top 40 juried student submissions across graphic editorial, spatial architecture, interactive web, and product design.',
      capacity: 'JURY ARCHIVE',
      location: 'HERITAGE CORRIDORS & SABARMATI PLINTH',
    },
  ];

  return (
    <section id="tracks" className="py-24 max-w-7xl mx-auto px-6 border-b border-[#8E8271]/20">
      {/* The 4 Academic Pillars */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs text-[#8A1829] tracking-widest uppercase">
          [DISCIPLINARY TAXONOMY]
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mt-2 text-[#FAF8F5]">
          The Four Academic Pillars
        </h2>
        <p className="font-serif text-[#CFC2AC] mt-4 text-base italic">
          "Form follows philosophy, not merely function."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {/* Pillar I */}
        <div className="p-6 bg-[#141110] border border-[#8E8271]/20 relative group hover:border-[#8A1829] transition">
          <div className="text-[#D4AF37] font-mono text-sm mb-4">PILLAR // 01</div>
          <h3 className="font-display text-lg uppercase text-white mb-3">Tectonic Materiality</h3>
          <p className="font-serif text-sm text-[#E2D9C8] leading-relaxed mb-6">
            Exploring vernacular brickwork, ceramic casting, mycelium composites, and non-extractive resource circularity.
          </p>
          <ul className="font-mono text-[11px] text-[#8E8271] space-y-1.5 border-t border-[#8E8271]/15 pt-4">
            <li>• Ceramic &amp; Glass Design</li>
            <li>• Furniture &amp; Interior Objects</li>
            <li>• Product &amp; Systemic Hardware</li>
          </ul>
        </div>

        {/* Pillar II */}
        <div className="p-6 bg-[#141110] border border-[#8E8271]/20 relative group hover:border-[#8A1829] transition">
          <div className="text-[#D4AF37] font-mono text-sm mb-4">PILLAR // 02</div>
          <h3 className="font-display text-lg uppercase text-white mb-3">Dialectical Semiotics</h3>
          <p className="font-serif text-sm text-[#E2D9C8] leading-relaxed mb-6">
            Subverting Western graphic dogmas to uncover multi-script Indic typography, rural iconography, and oral histories.
          </p>
          <ul className="font-mono text-[11px] text-[#8E8271] space-y-1.5 border-t border-[#8E8271]/15 pt-4">
            <li>• Graphic &amp; Communication Design</li>
            <li>• Animation Cinema</li>
            <li>• Film &amp; Video Production</li>
          </ul>
        </div>

        {/* Pillar III */}
        <div className="p-6 bg-[#141110] border border-[#8E8271]/20 relative group hover:border-[#8A1829] transition">
          <div className="text-[#D4AF37] font-mono text-sm mb-4">PILLAR // 03</div>
          <h3 className="font-display text-lg uppercase text-white mb-3">Tactile Computation</h3>
          <p className="font-serif text-sm text-[#E2D9C8] leading-relaxed mb-6">
            Interweaving machine learning models with physical looms, capacitive hand-woven interfaces, and ambient spatial sensors.
          </p>
          <ul className="font-mono text-[11px] text-[#8E8271] space-y-1.5 border-t border-[#8E8271]/15 pt-4">
            <li>• Textile &amp; Apparel Futures</li>
            <li>• New Media Design (IT-IoT)</li>
            <li>• Interaction Architecture</li>
          </ul>
        </div>

        {/* Pillar IV */}
        <div className="p-6 bg-[#141110] border border-[#8E8271]/20 relative group hover:border-[#8A1829] transition">
          <div className="text-[#D4AF37] font-mono text-sm mb-4">PILLAR // 04</div>
          <h3 className="font-display text-lg uppercase text-white mb-3">Civic &amp; Speculative</h3>
          <p className="font-serif text-sm text-[#E2D9C8] leading-relaxed mb-6">
            Designing for public health policies, disaster resistance, democratic civic participation, and multi-generational ecology.
          </p>
          <ul className="font-mono text-[11px] text-[#8E8271] space-y-1.5 border-t border-[#8E8271]/15 pt-4">
            <li>• Strategic Design Management</li>
            <li>• Universal Design</li>
            <li>• Exhibition &amp; Museum Space</li>
          </ul>
        </div>
      </div>

      {/* Curricular Tracks / Festival Experiences */}
      <div className="mt-8">
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8A1829] block mb-1">
            // IMMERSIVE ENVIRONMENTS
          </span>
          <h3 className="text-3xl sm:text-4xl font-display font-light text-[#FAF8F5]">
            More Than An Event.
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#CFC2AC] mt-2">
            Four autonomous experimental zones, each conceived with its own spatial cadence and material constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tracks.map((t, idx) => (
            <div
              key={idx}
              className="p-8 bg-[#161211]/80 border border-[#8E8271]/20 hover:border-[#8A1829] transition-all group relative overflow-hidden flex flex-col justify-between min-h-[340px]"
            >
              <div className="absolute top-0 right-0 p-8 font-serif text-7xl text-[#8E8271]/10 group-hover:text-[#8A1829]/20 transition-colors pointer-events-none">
                {t.num}
              </div>
              <div>
                <span className="font-mono text-xs tracking-widest uppercase text-[#8E8271] block mb-2">
                  {t.tag}
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-light mb-4 group-hover:text-[#EDE7DC] transition-colors">
                  {t.title}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#CFC2AC] leading-relaxed max-w-md">
                  {t.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#8E8271]/20 flex justify-between items-center text-xs font-mono tracking-widest uppercase text-[#8E8271]">
                <span>CAPACITY: {t.capacity}</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalTrack(t);
                    if (onInspectTrack) onInspectTrack(t.title);
                  }}
                  className="text-[#FAF8F5] hover:text-[#721724] flex items-center gap-2 transition"
                >
                  <span>EXPLORE SPEC</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Track Specification */}
      {activeModalTrack && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setActiveModalTrack(null)}
        >
          <div
            className="bg-[#1A1614] border border-[#8E8271]/40 max-w-lg w-full p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6 border-b border-[#8E8271]/20 pb-4">
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A1829] block">
                  {activeModalTrack.location}
                </span>
                <h4 className="font-serif text-3xl text-[#FAF8F5] font-light">
                  {activeModalTrack.title}
                </h4>
              </div>
              <button
                className="font-mono text-xs text-[#8E8271] hover:text-white uppercase p-1"
                onClick={() => setActiveModalTrack(null)}
              >
                ✕
              </button>
            </div>
            <p className="font-sans text-sm text-[#EDE7DC] leading-relaxed mb-6 font-light">
              {activeModalTrack.description}
            </p>
            <div className="border-t border-[#8E8271]/20 pt-4 flex justify-between items-center font-mono text-xs text-[#8E8271] uppercase tracking-wider">
              <span>STATUS: CONFIRMED FOR CONVOCATION</span>
              <button
                className="px-4 py-2 bg-[#4A0E17] text-white font-mono text-xs uppercase hover:bg-[#8A1829] transition"
                onClick={() => setActiveModalTrack(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
