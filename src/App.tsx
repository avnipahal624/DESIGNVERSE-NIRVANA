/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { HeroBook } from './components/HeroBook';
import { KineticLetterforms } from './components/KineticLetterforms';
import { CuratorialManifesto } from './components/CuratorialManifesto';
import { AtelierSection } from './components/AtelierSection';
import { AcademicPillars } from './components/AcademicPillars';
import { ProgrammeSchedule } from './components/ProgrammeSchedule';
import { PassGenerator } from './components/PassGenerator';
import { Footer } from './components/Footer';
import { ArtifactModal } from './components/ArtifactModal';
import { IndexModal } from './components/IndexModal';
import { ChapterProgressRail } from './components/ChapterProgressRail';
import { GlyphRunnerGame } from './components/GlyphRunnerGame';
import { AiStudioSuite } from './components/AiStudioSuite';

export default function App() {
  const [selectedGlyphIndex, setSelectedGlyphIndex] = useState<number | null>(null);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);

  // If in active 3D game mode: render full-viewport Game Shell strictly without navbar or footer
  if (isPlayingGame) {
    return <GlyphRunnerGame onExitGame={() => setIsPlayingGame(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0D0B0A] text-[#EDE7DC] selection:bg-[#4A0E17] selection:text-[#FAF8F5] relative antialiased">
      {/* Top Header / Running Marginalia */}
      <Header
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenGame={() => setIsPlayingGame(true)}
        onOpenAiStudio={() => setIsAiStudioOpen(true)}
      />

      {/* Thin Vertical Chapter Progress Indicator Rail */}
      <ChapterProgressRail />

      {/* Main Content Sections */}
      <main>
        {/* Chapter 00: The 3D Book Cover Hero */}
        <HeroBook />

        {/* Interactive 3D Game & AI Lab Callout Banner */}
        <section className="max-w-7xl mx-auto px-6 py-8 border-b border-[#8E8271]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3D Game Card */}
            <div className="p-6 bg-gradient-to-br from-[#1C1215] to-[#0E0B0A] border border-[#8A1829]/50 shadow-xl flex flex-col justify-between group hover:border-[#D4AF37] transition">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#8A1829] animate-pulse" />
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#D4AF37]">
                    THREE.JS 3D ARCADE
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-[#FAF8F5]">
                  GLYPH RUNNER 3D
                </h3>
                <p className="font-serif text-sm text-[#CFC2AC] leading-relaxed">
                  Pilot an articulated gyroscopic avatar down the cybernetic causeways of Kashmere Gate. Collect the 6 sacred typographic glyphs at 60 FPS with responsive physics and procedural synth audio.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => setIsPlayingGame(true)}
                  className="px-6 py-3 bg-[#8A1829] hover:bg-[#a82236] text-white font-mono text-xs font-bold uppercase tracking-widest transition flex items-center space-x-2 border border-[#D4AF37]/50 shadow-lg"
                >
                  <span>Launch 3D Game Shell</span>
                  <span>🎮</span>
                </button>
              </div>
            </div>

            {/* AI Lab Card */}
            <div className="p-6 bg-gradient-to-br from-[#171513] to-[#0E0B0A] border border-[#8E8271]/30 shadow-xl flex flex-col justify-between group hover:border-[#D4AF37] transition">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#D4AF37]">
                    MULTIMODAL AI LABORATORY
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-[#FAF8F5]">
                  SYNTHESIS SUITE
                </h3>
                <p className="font-serif text-sm text-[#CFC2AC] leading-relaxed">
                  Generate atmospheric music with Lyria 3, render high-fidelity architectural folios with Nano-Banana, animate photos into cinema with Veo, and query grounded Google Search research.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => setIsAiStudioOpen(true)}
                  className="px-6 py-3 bg-[#1F1A18] hover:bg-[#2E2723] text-[#D4AF37] border border-[#8E8271]/40 hover:border-[#D4AF37] font-mono text-xs font-bold uppercase tracking-widest transition flex items-center space-x-2"
                >
                  <span>Open Multimodal AI Lab</span>
                  <span>✨</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 01: Kinetic Typography Matrix (Dissecting the Glyphs) */}
        <KineticLetterforms
          onSelectGlyph={(index) => setSelectedGlyphIndex(index)}
        />

        {/* Chapter 02: Curatorial Note & The India Report Lineage */}
        <CuratorialManifesto />

        {/* Chapter 03: The Graduation Atelier */}
        <AtelierSection
          onInspectGlyph={(glyphIndex) => setSelectedGlyphIndex(glyphIndex)}
        />

        {/* Chapter 04: Disciplinary Taxonomy & Academic Pillars */}
        <AcademicPillars />

        {/* Chapter 05: Convocation & Symposium Schedule */}
        <ProgrammeSchedule />

        {/* Chapter 06: Ticket Engraving Engine / Delegate Pass Generator */}
        <PassGenerator />
      </main>

      {/* Footer Colophon */}
      <Footer />

      {/* Interactive 3D Artifact Investigation Chamber Modal */}
      <ArtifactModal
        selectedIndex={selectedGlyphIndex}
        onClose={() => setSelectedGlyphIndex(null)}
        onNavigate={(newIndex) => setSelectedGlyphIndex(newIndex)}
      />

      {/* Directory Index Overlay Modal */}
      <IndexModal
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
      />

      {/* Multimodal AI Studio Modal */}
      <AiStudioSuite
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
      />
    </div>
  );
}
