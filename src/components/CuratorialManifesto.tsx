export function CuratorialManifesto() {
  return (
    <section
      id="manifesto"
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-[#8E8271]/20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: The Historical Foundation */}
        <div className="lg:col-span-5 space-y-8 font-mono text-xs">
          <div className="p-6 bg-[#161211] border-l-4 border-[#8A1829] space-y-4 shadow-xl">
            <div className="flex justify-between items-center text-[#CFC2AC]">
              <span>HISTORICAL ARCHIVE // 1958</span>
              <span className="text-[#D4AF37]">NID FOUNDATIONAL CHARTER</span>
            </div>
            <h3 className="font-display text-xl text-[#FAF8F5] uppercase tracking-wide">
              The Eames India Report Lineage
            </h3>
            <p className="font-serif text-sm leading-relaxed text-[#E2D9C8]">
              "A sober examination of the values and their relationship for survival in the face of inevitable, rapacious industrialization... looking at the Lota as an uninhibited, thoughtful synthesis of utility and grace."
            </p>
            <div className="pt-2 text-[10px] text-[#8E8271] uppercase tracking-widest">
              — Charles and Ray Eames, National Institute of Design Charter
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#8E8271]/20">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#EDE7DC]">
              The 2025 Convergence
            </h4>
            <p className="font-sans text-[#CFC2AC] leading-relaxed text-sm">
              Six decades onward, Designverse translates the eternal wisdom of the Lota into computational geometries, synthetic biology substrates, algorithmic weaving looms, and spatial interfaces.
            </p>
            <div className="flex items-center space-x-6 text-[11px] text-[#8E8271]">
              <div>
                <span className="block text-[#FAF8F5] font-bold text-base">420</span>
                <span>Graduating Candidates</span>
              </div>
              <div>
                <span className="block text-[#FAF8F5] font-bold text-base">64</span>
                <span>Years of Pedagogy</span>
              </div>
              <div>
                <span className="block text-[#FAF8F5] font-bold text-base">3</span>
                <span>Historic Campuses</span>
              </div>
            </div>
          </div>

          {/* Architectural Atelier Photo Specimen */}
          <div className="relative aspect-[16/10] overflow-hidden border border-[#8E8271]/30 shadow-2xl group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWlHWSdqzP077Jar61x5o6uw_UgIPifZK684ApQIPcw7wG7uwPRz8xftgFyqBRZn0cdIbZ3_3FhOsZk6mkntu-4RU7hBDTkhWPffq-Y5OV6rXNsbjMc-hhBTHbIWAuyiG_hgjgRNUjaBhPq7oLuGTa2LJmcRwz_jwA3EpyCxvtl4Tc83GLkOeW0aXgn-VldojDrstj4v47QRi87vWkdlRgd2rhm6XkMYILfLpRkkguRjRV1VgXV5p_"
              alt="Monolithic brutalist architecture with warm sunlight"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-[10px] text-white">
              <span>FIG. 01 — THE MONOLITHIC PAVILION</span>
              <span className="text-[#8E8271]">[23.0131° N]</span>
            </div>
          </div>
        </div>

        {/* Right Column: Curatorial Essay */}
        <div className="lg:col-span-7 space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8A1829]">
            [ESSAY // CURATORIAL NOTE]
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-[#FAF8F5] leading-tight">
            Beyond the Silicon Loom:{' '}
            <span className="font-serif italic font-normal text-[#721724]">
              Crafting the Synthetic Vernacular
            </span>
          </h2>
          <div className="prose prose-invert max-w-none font-serif text-base md:text-lg leading-relaxed text-[#E2D9C8] space-y-4">
            <p>
              Designverse 2025 marks the threshold where computational intelligence ceases to be a distant technical oracle and instead enters the artisan's courtyard as an intuitive material. In our studios at Ahmedabad, Gandhinagar, and Bengaluru, our scholars did not simply design interfaces or physical products; they articulated ethical postures against mechanical homogeneity.
            </p>
            <p className="text-[#CFC2AC] font-sans text-sm md:text-base">
              From the raw brick corridors conceived by Gautam and Gira Sarabhai to the clean WebGL viewports of this digital monograph, the pursuit remains singular: design as an instrument of sovereign cultural identity, social parity, and ecological repair.
            </p>
            <p className="text-[#CFC2AC] font-sans text-sm md:text-base">
              We abandon decorative finishes in favor of physical evidence: clay extruded via 6-axis robotic arms, living bioluminescent silk filaments, generative Indian typography engines, and unbleached cotton paper printed through two-color Risographs.
            </p>
          </div>

          <div className="pt-6 border-t border-[#8E8271]/20 flex flex-wrap gap-3 font-mono text-xs">
            <span className="px-3 py-1 bg-[#8E8271]/10 border border-[#8E8271]/30 text-[#EDE7DC]">
              #IndigenousFuturism
            </span>
            <span className="px-3 py-1 bg-[#8E8271]/10 border border-[#8E8271]/30 text-[#EDE7DC]">
              #AlgorithmicCraft
            </span>
            <span className="px-3 py-1 bg-[#8E8271]/10 border border-[#8E8271]/30 text-[#EDE7DC]">
              #SpatialPedagogy
            </span>
            <span className="px-3 py-1 bg-[#8E8271]/10 border border-[#8E8271]/30 text-[#EDE7DC]">
              #ZeroWasteMateriality
            </span>
          </div>

          {/* Secondary Atelier Photo */}
          <div className="mt-8 border border-[#8E8271]/30 overflow-hidden shadow-2xl relative aspect-[16/9] group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq83ybfCm9PZgBePy-mQbGUwpkjNBgXFP7UXerNtoN_06cFNJPf8OSfKEeQ9Cv8OWoxXvOauUJV1NzVjrMWH4mLo0IXQuBw8nTL08z0fVWeVwkeet3qZFIDktENQz_sbK3BbJKfipjkW1mhO_-FI8pnmDgEWfOzLUKH_eHRWAm9jMlsY-YWr7mlvQnHdF-oVUTSG8bTHzGg792aUrBZ7j_s5jGp7ai-5Sf6yHU8W5cvVM--kHmPbHn"
              alt="Experimental design studio atelier with tactile prototypes, wooden models and swatches"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-xs font-mono text-white">
              <div>
                <span className="text-[10px] text-[#721724] uppercase tracking-wider block">
                  ATELIER NOTE #84
                </span>
                <span className="font-serif italic text-sm text-[#FAF8F5]">
                  “Where Ideas Take Form” — Physical fabrication studies
                </span>
              </div>
              <span className="text-[#8E8271] text-[10px]">PALDI ATELIER</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
