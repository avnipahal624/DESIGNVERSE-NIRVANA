export function Footer() {
  return (
    <footer className="bg-[#090807] border-t border-[#8E8271]/20 py-16 px-6 font-mono text-xs text-[#8E8271]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <h5 className="font-display font-bold text-white uppercase text-sm tracking-wider">
            INDIRA GANDHI DELHI TECHNOLOGICAL UNIVERSITY
          </h5>
          <p className="font-serif text-sm text-[#CFC2AC] leading-relaxed">
            Pioneering non-linear pedagogy, women's technical leadership, and experimental design engineering in the historic capital of India.
          </p>
          <span className="text-[10px] text-[#8E8271] block">
            Kashmere Gate Heritage Campus, New Delhi — 110006, India
          </span>
        </div>

        <div className="space-y-2">
          <h6 className="text-[#EDE7DC] font-bold uppercase tracking-wider text-[11px]">
            DISCIPLINARY FACULTIES
          </h6>
          <ul className="space-y-1 text-[11px] text-[#CFC2AC]">
            <li><a className="hover:text-white transition" href="#atelier">Industrial &amp; Product Design</a></li>
            <li><a className="hover:text-white transition" href="#atelier">Communication Design</a></li>
            <li><a className="hover:text-white transition" href="#atelier">Textile, Apparel, Lifestyle</a></li>
            <li><a className="hover:text-white transition" href="#atelier">Interdisciplinary Design Studies</a></li>
            <li><a className="hover:text-white transition" href="#atelier">Digital Media &amp; Virtual Heritage</a></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h6 className="text-[#EDE7DC] font-bold uppercase tracking-wider text-[11px]">
            CAMPUS &amp; RESEARCH DEPARTMENTS
          </h6>
          <ul className="space-y-1 text-[11px] text-[#CFC2AC]">
            <li>Kashmere Gate Main Heritage Campus</li>
            <li>Dept. of Artificial Intelligence &amp; Data Sciences</li>
            <li>Dept. of Architecture &amp; Regional Planning</li>
            <li>Dept. of Electronics &amp; Communication Eng.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h6 className="text-[#EDE7DC] font-bold uppercase tracking-wider text-[11px]">
            EXHIBITION MONOGRAPH
          </h6>
          <p className="text-[11px] text-[#CFC2AC] leading-relaxed">
            Designverse 2025 WebGL edition designed in tribute to the foundational typography of the Sarabhai Foundation, Eames India Report, and Adrian Frutiger.
          </p>
          <div className="text-[10px] text-[#721724] font-bold pt-1">
            © 2025 NIRVANA SOCIETY &amp; INDIRA GANDHI DELHI TECHNOLOGICAL UNIVERSITY. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}
