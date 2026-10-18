import { useState } from 'react';

export function PassGenerator() {
  const [delegateName, setDelegateName] = useState('Prof. Arundhati Sen');
  const [affiliation, setAffiliation] = useState('Royal College of Art, London');
  const [discipline, setDiscipline] = useState('Industrial & Spatial Architecture');
  const [passHash, setPassHash] = useState('HASH #882-B25');
  const [isStamping, setIsStamping] = useState(false);
  const [isIssued, setIsIssued] = useState(false);

  const regenerateHash = () => {
    setIsStamping(true);
    const num = Math.floor(100 + Math.random() * 900);
    const hex = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0');
    setPassHash(`HASH #${num}-${hex.slice(0, 3)}`);
    setTimeout(() => {
      setIsStamping(false);
    }, 250);
  };

  const handlePrint = () => {
    setIsIssued(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <section id="pass" className="py-24 max-w-7xl mx-auto px-6 border-b border-[#8E8271]/20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#8A1829]">
              [TICKET ENGRAVING ENGINE]
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase text-[#FAF8F5] mt-2">
              Generate Your Exhibition Pass
            </h2>
            <p className="font-serif text-[#CFC2AC] mt-2 text-sm leading-relaxed">
              Enter your credentials to mint a personalized, high-security typographical pass with verifiable spatial cryptographic seal.
            </p>
          </div>

          <form
            className="space-y-4 font-mono text-xs"
            onSubmit={(e) => {
              e.preventDefault();
              handlePrint();
            }}
          >
            <div>
              <label className="block text-[#8E8271] uppercase text-[10px] tracking-wider mb-1">
                DELEGATE FULL NAME *
              </label>
              <input
                type="text"
                required
                value={delegateName}
                onChange={(e) => setDelegateName(e.target.value)}
                placeholder="e.g. Prof. Arundhati Sen"
                className="w-full bg-[#181312] border border-[#8E8271]/30 focus:border-[#8A1829] focus:outline-none text-[#F5F2EB] px-4 py-2.5 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8E8271] uppercase text-[10px] tracking-wider mb-1">
                  ORGANIZATION / INSTITUTION *
                </label>
                <input
                  type="text"
                  required
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="e.g. Royal College of Art"
                  className="w-full bg-[#181312] border border-[#8E8271]/30 focus:border-[#8A1829] focus:outline-none text-[#F5F2EB] px-4 py-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-[#8E8271] uppercase text-[10px] tracking-wider mb-1">
                  DISCIPLINE OF INTEREST
                </label>
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full bg-[#181312] border border-[#8E8271]/30 focus:border-[#8A1829] focus:outline-none text-[#F5F2EB] px-4 py-2.5 font-mono cursor-pointer"
                >
                  <option value="Industrial & Spatial Architecture">Industrial &amp; Spatial</option>
                  <option value="Textile Futures & Biomaterials">Textile Futures</option>
                  <option value="Communication & Indic Type">Communication &amp; Type</option>
                  <option value="New Media & VR Environments">New Media &amp; VR</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={regenerateHash}
                className="px-4 py-2 bg-black/60 border border-[#8E8271]/30 text-[#CFC2AC] hover:text-white uppercase tracking-wider text-[11px] transition"
              >
                [⟳ Regenerate Hash]
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#4A0E17] hover:bg-[#8A1829] text-white uppercase tracking-wider text-[11px] font-bold transition flex items-center space-x-1.5 shadow-lg"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Engrave Pass (Print)</span>
              </button>
            </div>

            {isIssued && (
              <div className="text-[11px] text-[#D4AF37] pt-1">
                ✓ Pass verification registered in local session index. Ready for print.
              </div>
            )}
          </form>
        </div>

        {/* Right: Pass Visualizer (Intaglio Ticket Style) */}
        <div className="lg:col-span-6 flex justify-center">
          <div
            id="printablePass"
            className={`w-full max-w-md bg-[#1B1614] border-2 border-[#54111c] shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between aspect-[1.58/1] transition-transform duration-200 ${
              isStamping ? 'scale-95 brightness-125' : 'scale-100'
            }`}
          >
            {/* Background watermark seal */}
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none select-none">
              <span className="font-display text-9xl text-[#D4AF37]">IGDTUW</span>
            </div>

            {/* Top stub bar */}
            <div className="flex justify-between items-start border-b border-[#8E8271]/20 pb-3 relative z-10">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#721724] font-bold block">
                  IGDTUW CONVOCATION &amp; EXHIBITION
                </span>
                <h4 className="font-display text-lg uppercase tracking-wider text-[#FAF8F5]">
                  OFFICIAL DELEGATE PASS
                </h4>
              </div>
              <div className="text-right font-mono text-[9px] text-[#8E8271]">
                <span className="text-[#D4AF37] font-bold block">{passHash}</span>
                <div>NEW DELHI, IN</div>
              </div>
            </div>

            {/* Center info */}
            <div className="my-4 space-y-3 relative z-10">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#8E8271] block">
                  DELEGATE NAME
                </span>
                <div className="font-serif italic text-2xl text-[#FAF8F5] font-bold tracking-wide">
                  {delegateName || 'YOUR NAME HERE'}
                </div>
              </div>

              <div className="flex justify-between items-end text-xs font-mono">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-[#8E8271] block">
                    AFFILIATION
                  </span>
                  <span className="text-[#CFC2AC]">
                    {affiliation || 'UNIVERSITY / STUDIO'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] uppercase tracking-widest text-[#8E8271] block">
                    ACCESS CATEGORY
                  </span>
                  <span className="text-[#721724] font-bold">
                    {discipline.split('&')[0].trim()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom barcode / security guilloche bar */}
            <div className="border-t border-[#8E8271]/20 pt-3 flex items-center justify-between font-mono text-[9px] text-[#8E8271] relative z-10">
              <div className="flex items-center space-x-2">
                {/* SVG/CSS Barcode lines */}
                <div className="flex space-x-0.5 h-6 items-end">
                  <div className="w-1 h-full bg-[#FAF8F5]" />
                  <div className="w-0.5 h-full bg-[#FAF8F5]" />
                  <div className="w-1.5 h-full bg-[#FAF8F5]" />
                  <div className="w-0.5 h-4 bg-[#FAF8F5]" />
                  <div className="w-1 h-full bg-[#FAF8F5]" />
                  <div className="w-2 h-full bg-[#FAF8F5]" />
                  <div className="w-0.5 h-5 bg-[#FAF8F5]" />
                  <div className="w-1 h-full bg-[#FAF8F5]" />
                  <div className="w-1.5 h-3 bg-[#FAF8F5]" />
                  <div className="w-0.5 h-full bg-[#FAF8F5]" />
                  <div className="w-1.5 h-full bg-[#FAF8F5]" />
                </div>
                <span>ADMIT ONE // ALL CAMPUSES</span>
              </div>
              <div className="text-[#D4AF37] font-bold">
                ★ SEALED 2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
