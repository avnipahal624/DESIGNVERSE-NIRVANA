export interface Artifact {
  letter: string;
  plateCode: string;
  discipline: string;
  category: string;
  title: string;
  author: string;
  dept: string;
  campus: string;
  year: string;
  scale: string;
  image: string;
  materials: string[];
  abstract: string;
  critique: string;
  accentColor: string;
}

export const LETTER_ARTIFACTS: Artifact[] = [
  {
    letter: 'D',
    plateCode: 'PL.01 / GLYPH [D]',
    discipline: 'ARCHITECTURAL DECONSTRUCTION',
    category: 'SPATIAL PROTOTYPING',
    title: 'Monolithic Void: Basalt & Interlocking Liminalities',
    author: 'Aanya Sharma',
    dept: 'Dept of Architecture & Spatial Design, 4th Year',
    campus: 'Paldi, Ahmedabad',
    year: 'EDITION 2025 // NID FELLOW',
    scale: 'SCALE 1:20 ARCHETYPE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWlHWSdqzP077Jar61x5o6uw_UgIPifZK684ApQIPcw7wG7uwPRz8xftgFyqBRZn0cdIbZ3_3FhOsZk6mkntu-4RU7hBDTkhWPffq-Y5OV6rXNsbjMc-hhBTHbIWAuyiG_hgjgRNUjaBhPq7oLuGTa2LJmcRwz_jwA3EpyCxvtl4Tc83GLkOeW0aXgn-VldojDrstj4v47QRi87vWkdlRgd2rhm6XkMYILfLpRkkguRjRV1VgXV5p_',
    materials: [
      '• Hand-Chiselled Dholpur Sandstone',
      '• Raw Basalt Aggregate 2400kg/m³',
      '• Oxidised Cold-Rolled Carbon Steel',
      '• Micro-cement Surface Sealant'
    ],
    abstract: 'An investigation into negative volume as an active structural agent. Rather than erecting walls to define space, the monolith is carved away using computational boolean operations calibrated to Indian subcontinent sunpaths. The resulting light chambers modulate internal temperatures without active HVAC.',
    critique: '“A searing critique of contemporary curtain-wall glass boxes. Sharma achieves a raw monumental gravity that feels both ancient and radical.” — Prof. K. Mukherjee',
    accentColor: '#8A1829'
  },
  {
    letter: 'E',
    plateCode: 'PL.02 / GLYPH [E]',
    discipline: 'KINETIC TENSION MEMBRANES',
    category: 'RESPONSIVE ENVIRONMENTS',
    title: 'Tensegrity Sheen: Adaptive Carbon Filaments',
    author: 'Rhea Sengupta & Diya Kapoor',
    dept: 'Industrial & Mechanical Innovation, 3rd Year',
    campus: 'Gandhinagar Campus',
    year: 'FOLIO 2025 // BUILD LAB RESIDENCY',
    scale: 'SCALE 1:1 CANOPY PROTOTYPE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq83ybfCm9PZgBePy-mQbGUwpkjNBgXFP7UXerNtoN_06cFNJPf8OSfKEeQ9Cv8OWoxXvOauUJV1NzVjrMWH4mLo0IXQuBw8nTL08z0fVWeVwkeet3qZFIDktENQz_sbK3BbJKfipjkW1mhO_-FI8pnmDgEWfOzLUKH_eHRWAm9jMlsY-YWr7mlvQnHdF-oVUTSG8bTHzGg792aUrBZ7j_s5jGp7ai-5Sf6yHU8W5cvVM--kHmPbHn',
    materials: [
      '• Pre-stressed Carbon Fiber Tow',
      '• Anodized Aircraft-grade Titanium 6Al-4V',
      '• Micro-servo Tension Actuators',
      '• Unbleached Silk Crepe Organza'
    ],
    abstract: 'A dynamic kinetic lattice that breathes under mechanical stimulus. By counter-balancing tensile silk threads with titanium compression struts, this pavilion canopy expands by 42% in surface area during solar peaks, casting parametric shadows across the historical courtyard.',
    critique: '“The marriage between delicate hand-pulled silk and computational aero-grade tension is executed with exceptional structural finesse.” — Ar. S. Nair',
    accentColor: '#721724'
  },
  {
    letter: 'S',
    plateCode: 'PL.03 / GLYPH [S]',
    discipline: 'GENERATIVE EDITORIAL SYSTEMS',
    category: 'COMPUTATIONAL TYPOGRAPHY',
    title: 'Syllabic Friction: Generative Risograph Matrices',
    author: 'Tanvi Nair',
    dept: 'Communication Design & Typography, 4th Year',
    campus: 'Paldi, Ahmedabad',
    year: 'EDITION 2025 // PRINT ATELIER',
    scale: 'FOLIO SIZE 420 × 594 MM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBchn5SYhsWD1iqFzeSab-wMsK9-vzdIdGCalBiEAp7u_m9lsFuBcDuRxjbesgGd0km4B8Nwykr4YhaqAqwTMpLBFT3ZtEd0Bo6VeyVa7EmNmCKucn4iEkML7KcU3iR3ax8QjI6A_W_qVWMOoWGTO13GE4b_Z7Qyxhm4T7BxCR70OyWwZ0RobntHRLJrcVHp4HwB70_Wqyv2e4WRCqr9jTuqZF2ZJI1hzq5fCtLdu65naRSZ7gBySlm',
    materials: [
      '• 100% Cotton Rives BFK 280gsm',
      '• Custom Soya Inks: Oxblood & Charcoal',
      '• Algorithmic Glyphic Splines (WebGL)',
      '• Cold-pressed Brass Bookbinding Rivets'
    ],
    abstract: 'Syllabic Friction tests what happens when classic Roman serif typography is broken apart by fluid displacement equations and manually printed through two-color Risograph cylinders. Each numbered copy possesses unique mechanical ink artifacts and micro-registration drifts.',
    critique: '“A profound rebuttal to algorithmic uniformity. The deliberate ink imperfections celebrate the physical friction of paper and speed.” — NID Editorial Board',
    accentColor: '#9E2A3B'
  },
  {
    letter: 'I',
    plateCode: 'PL.04 / GLYPH [I]',
    discipline: 'IMMERSIVE AMBIENT MEDIA',
    category: 'SPATIAL COMPUTING & ACOUSTICS',
    title: 'Acoustic Colonnade: Soundscape Resonance Well',
    author: 'Meera Chawla',
    dept: 'New Media Design & Sound, 3rd Year',
    campus: 'Bengaluru Campus',
    year: 'EDITION 2025 // INNOVATION WING',
    scale: 'SCALE 1:1 ACOUSTIC COLUMN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWlHWSdqzP077Jar61x5o6uw_UgIPifZK684ApQIPcw7wG7uwPRz8xftgFyqBRZn0cdIbZ3_3FhOsZk6mkntu-4RU7hBDTkhWPffq-Y5OV6rXNsbjMc-hhBTHbIWAuyiG_hgjgRNUjaBhPq7oLuGTa2LJmcRwz_jwA3EpyCxvtl4Tc83GLkOeW0aXgn-VldojDrstj4v47QRi87vWkdlRgd2rhm6XkMYILfLpRkkguRjRV1VgXV5p_',
    materials: [
      '• Sintered Porous Ceramic Cylinders',
      '• Sub-bass Piezo Transducers',
      '• Raw Red Terracotta Slipware',
      '• Embedded Spatial Audio DSP Nodes'
    ],
    abstract: 'Installed within the heritage arched colonnade, this acoustic well captures footsteps and murmurs, transmuting them into deep sub-harmonic tones that vibrate the porous terracotta casing. Delegates touch the warm clay to feel sound physically resonating through bone conduction.',
    critique: '“Transforms spatial navigation into an intimate haptic sensation. Outstanding interplay of vernacular clay and digital resonance.” — Dr. P. Varma',
    accentColor: '#8A1829'
  },
  {
    letter: 'G',
    plateCode: 'PL.05 / GLYPH [G]',
    discipline: 'BIO-FABRICATION & MATERIALITY',
    category: 'GROWTH BIO-DESIGN',
    title: 'Myco-Vault: Mycelium Structural Formwork',
    author: 'Kritika Bose',
    dept: 'Ceramic & Glass / Material Futures, Final Year',
    campus: 'Paldi, Ahmedabad',
    year: 'EDITION 2025 // NID FELLOW',
    scale: 'SCALE 1:10 STRUCTURAL ARCH',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq83ybfCm9PZgBePy-mQbGUwpkjNBgXFP7UXerNtoN_06cFNJPf8OSfKEeQ9Cv8OWoxXvOauUJV1NzVjrMWH4mLo0IXQuBw8nTL08z0fVWeVwkeet3qZFIDktENQz_sbK3BbJKfipjkW1mhO_-FI8pnmDgEWfOzLUKH_eHRWAm9jMlsY-YWr7mlvQnHdF-oVUTSG8bTHzGg792aUrBZ7j_s5jGp7ai-5Sf6yHU8W5cvVM--kHmPbHn',
    materials: [
      '• Ganoderma Mycelium Culture',
      '• Agricultural Wheat Straw Substrate',
      '• 3D Printed Hemp Bio-composite Shell',
      '• Natural Beeswax Moisture Seal'
    ],
    abstract: 'Myco-Vault proves structural compressive capabilities of living root networks grown inside precision 3D printed molds. In seven days, agricultural waste transforms into an ultra-lightweight, flame-retardant vault block possessing acoustic absorption 300% superior to concrete.',
    critique: '“A decisive demonstration that the next generation of architectural building components can be grown from earth rather than blasted from quarries.” — Green Architecture Forum',
    accentColor: '#651D2B'
  },
  {
    letter: 'N',
    plateCode: 'PL.06 / GLYPH [N]',
    discipline: 'NEO-TACTILE INTERFACES',
    category: 'HAPTIC HARDWARE',
    title: 'Nerve Loom: Conductive Silk Weft Interface',
    author: 'Ananya Roy & Zoya Farooqui',
    dept: 'Textile & Interaction Lab, 4th Year',
    campus: 'Gandhinagar Campus',
    year: 'EDITION 2025 // BUILD LAB RESIDENCY',
    scale: 'FOLIO 800 × 1200 MM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBchn5SYhsWD1iqFzeSab-wMsK9-vzdIdGCalBiEAp7u_m9lsFuBcDuRxjbesgGd0km4B8Nwykr4YhaqAqwTMpLBFT3ZtEd0Bo6VeyVa7EmNmCKucn4iEkML7KcU3iR3ax8QjI6A_W_qVWMOoWGTO13GE4b_Z7Qyxhm4T7BxCR70OyWwZ0RobntHRLJrcVHp4HwB70_Wqyv2e4WRCqr9jTuqZF2ZJI1hzq5fCtLdu65naRSZ7gBySlm',
    materials: [
      '• Silver-Coated Nylon Yarn Weft',
      '• Varanasi Mulberry Raw Silk Warp',
      '• Capacitive Micro-Controllers (BLE)',
      '• Solid Walnut Tensioning Frame'
    ],
    abstract: 'Nerve Loom bridges centuries-old jacquard weaving traditions with continuous multi-touch sensing. Stroking the velvet and twill patterns generates complex midi data and modulates typographic weights on surrounding exhibition projections in real time.',
    critique: '“Seamlessly honors craft heritage while redefining input peripherals beyond flat glass touchscreens.” — Interaction Guild Jurors',
    accentColor: '#721724'
  },
  {
    letter: 'V',
    plateCode: 'PL.07 / GLYPH [V]',
    discipline: 'VOID DYNAMICS & VOLUMETRICS',
    category: 'HERITAGE SPATIAL ADAPTATION',
    title: 'Vortex Light Chamber: Sabarmati Oculus',
    author: 'Ipsita Sen',
    dept: 'Exhibition & Spatial Architecture, 5th Year',
    campus: 'Paldi, Ahmedabad',
    year: 'EDITION 2025 // LEAD CURATOR SELECTION',
    scale: 'SCALE 1:50 MONUMENTAL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWlHWSdqzP077Jar61x5o6uw_UgIPifZK684ApQIPcw7wG7uwPRz8xftgFyqBRZn0cdIbZ3_3FhOsZk6mkntu-4RU7hBDTkhWPffq-Y5OV6rXNsbjMc-hhBTHbIWAuyiG_hgjgRNUjaBhPq7oLuGTa2LJmcRwz_jwA3EpyCxvtl4Tc83GLkOeW0aXgn-VldojDrstj4v47QRi87vWkdlRgd2rhm6XkMYILfLpRkkguRjRV1VgXV5p_',
    materials: [
      '• Teak Wood Scale Framework',
      '• Optical Dichroic Glass Shards',
      '• Weathered Copper Strips',
      '• Cast Gypsum Plaster'
    ],
    abstract: 'Conceived for the historic riverfront colonnade, this inverted prism captures morning dust beams, bending sunlight through micro-dichroic filters that cast warm oxblood halos onto historic masonry walls.',
    critique: '“A masterclass in restraint. It respects historical scar tissue without succumbing to nostalgic pastiche.” — Visiting Juror',
    accentColor: '#B7AA96'
  },
  {
    letter: 'E',
    plateCode: 'PL.08 / GLYPH [E]',
    discipline: 'EPHEMERAL CODE ARCHITECTURE',
    category: 'WEBGL SHADER ARTIFACTS',
    title: 'Entropy Engine: Mathematical Erosion in Realtime',
    author: 'Pooja Vishwanath',
    dept: 'New Media & Computational Arts, 3rd Year',
    campus: 'Bengaluru Campus',
    year: 'EDITION 2025 // HACKATHON GRAND LAUREATE',
    scale: 'COMPUTATIONAL RESOLUTION 4K',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq83ybfCm9PZgBePy-mQbGUwpkjNBgXFP7UXerNtoN_06cFNJPf8OSfKEeQ9Cv8OWoxXvOauUJV1NzVjrMWH4mLo0IXQuBw8nTL08z0fVWeVwkeet3qZFIDktENQz_sbK3BbJKfipjkW1mhO_-FI8pnmDgEWfOzLUKH_eHRWAm9jMlsY-YWr7mlvQnHdF-oVUTSG8bTHzGg792aUrBZ7j_s5jGp7ai-5Sf6yHU8W5cvVM--kHmPbHn',
    materials: [
      '• WebGL 2.0 Fragment Shaders',
      '• Brownian Displacement Equations',
      '• 10-bit Monochrome OLED Display Slab',
      '• Raw Milled Aluminum Heat Sink'
    ],
    abstract: 'An autonomous digital sculpture displaying monolithic 3D serif glyphs that slowly erode based on real-time atmospheric particulate readings. Code becomes weathering stone.',
    critique: '“Poetically bridges environmental climate reality with high-art computational rendering.” — NID Tech Fellows',
    accentColor: '#8A1829'
  },
  {
    letter: 'R',
    plateCode: 'PL.09 / GLYPH [R]',
    discipline: 'RADICAL ROBOTIC CRAFT',
    category: 'DIGITAL FABRICATION',
    title: 'Rhizome Automata: 6-Axis Robotic Clay Extrusion',
    author: 'Suhani Mathur',
    dept: 'Product & Furniture Design, 4th Year',
    campus: 'Paldi, Ahmedabad',
    year: 'EDITION 2025 // INNOVATION WING',
    scale: 'SCALE 1:1 FREESTANDING 180CM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBchn5SYhsWD1iqFzeSab-wMsK9-vzdIdGCalBiEAp7u_m9lsFuBcDuRxjbesgGd0km4B8Nwykr4YhaqAqwTMpLBFT3ZtEd0Bo6VeyVa7EmNmCKucn4iEkML7KcU3iR3ax8QjI6A_W_qVWMOoWGTO13GE4b_Z7Qyxhm4T7BxCR70OyWwZ0RobntHRLJrcVHp4HwB70_Wqyv2e4WRCqr9jTuqZF2ZJI1hzq5fCtLdu65naRSZ7gBySlm',
    materials: [
      '• High-Fire Stoneware Terracotta Paste',
      '• Industrial 6-Axis Arm Toolpath',
      '• Oxblood Glaze with Iron Oxide Flecks',
      '• Laser-cut Steel Stabilizer Base'
    ],
    abstract: 'By feeding non-uniform parametric wave coordinates directly to an industrial robotic arm, Suhani creates undulating terracotta column skins that mimic natural cave formations. Toolpath errors are welcomed as organic tactile expressions.',
    critique: '“Reclaiming high-precision industrial robotics for tactile, soulful ceramic craft.” — Head of Build Lab',
    accentColor: '#721724'
  },
  {
    letter: 'S',
    plateCode: 'PL.10 / GLYPH [S]',
    discipline: 'SPECULATIVE CLIMATE FUTURES',
    category: 'SPECULATIVE PRODUCT DESIGN',
    title: 'Solar Siphon: Atmospheric Fog Harvesting Vessel',
    author: 'Bhavna Kulkarni & Nidhi Jain',
    dept: 'Universal & Industrial Design, 4th Year',
    campus: 'Paldi, Ahmedabad',
    year: 'EDITION 2025 // JURY FELLOW',
    scale: 'SCALE 1:2 FUNCTIONAL FIELD UNIT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWlHWSdqzP077Jar61x5o6uw_UgIPifZK684ApQIPcw7wG7uwPRz8xftgFyqBRZn0cdIbZ3_3FhOsZk6mkntu-4RU7hBDTkhWPffq-Y5OV6rXNsbjMc-hhBTHbIWAuyiG_hgjgRNUjaBhPq7oLuGTa2LJmcRwz_jwA3EpyCxvtl4Tc83GLkOeW0aXgn-VldojDrstj4v47QRi87vWkdlRgd2rhm6XkMYILfLpRkkguRjRV1VgXV5p_',
    materials: [
      '• Hydrophobic Micro-Mesh Copper Alloy',
      '• Hand-Blown Borosilicate Condenser Bulb',
      '• Smoked Teak Wood Structural Yoke',
      '• Vegetable-Tanned Harness Leather'
    ],
    abstract: 'Designed for arid semi-urban outskirts, this zero-electricity siphon uses nocturnal radiative cooling and hydrophobic copper meshes to collect 3.4 liters of pure condensation per night from early-morning dew and smog inversions.',
    critique: '“A rigorous blend of thermodynamic physics and heirloom luxury object design.” — Social Innovation Panel',
    accentColor: '#651D2B'
  },
  {
    letter: 'E',
    plateCode: 'PL.11 / GLYPH [E]',
    discipline: 'EPILOGUE: THE LIVING PUBLICATION',
    category: 'MONUMENTAL ARCHIVE',
    title: 'The Monumental Folio: Bound Basalt & Oxblood Silk',
    author: 'Nirvana Curatorial Collective',
    dept: 'Interdisciplinary Festival Guild, Indira Gandhi Delhi Technological University',
    campus: 'Kashmere Gate Heritage Campus, New Delhi',
    year: 'EDITION 2025 // FESTIVAL CATALOGUE ZERO',
    scale: 'FOLIO 600 × 900 MM // 38 KG',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBchn5SYhsWD1iqFzeSab-wMsK9-vzdIdGCalBiEAp7u_m9lsFuBcDuRxjbesgGd0km4B8Nwykr4YhaqAqwTMpLBFT3ZtEd0Bo6VeyVa7EmNmCKucn4iEkML7KcU3iR3ax8QjI6A_W_qVWMOoWGTO13GE4b_Z7Qyxhm4T7BxCR70OyWwZ0RobntHRLJrcVHp4HwB70_Wqyv2e4WRCqr9jTuqZF2ZJI1hzq5fCtLdu65naRSZ7gBySlm',
    materials: [
      '• Chiseled Indian Black Granite Cover Slab',
      '• 240gsm Uncut Deckle-Edge Cotton Rag',
      '• Hand-dyed Deep Oxblood Raw Silk Ribbon',
      '• Cast Bronze Spine Hinges & Screws'
    ],
    abstract: 'The culminating artifact of DESIGNVERSE 2025. A 38-kilogram monolithic volume binding the entire festival archive: sketches, failed prototypes, raw transcripts, and code repositories. Only three physical copies exist in the world.',
    critique: '“The book as architecture. A permanent physical testament that student ideas will never stay flat.” — Festival Director Statement',
    accentColor: '#8A1829'
  }
];

export interface AtelierProject {
  id: string;
  catalogNo: string;
  category: 'industrial' | 'communication' | 'textile' | 'spatial';
  degree: string;
  title: string;
  description: string;
  candidate: string;
  advisors: string;
  attributeLabel: string;
  attributeValue: string;
  campus: string;
  associatedGlyphIndex: number;
}

export const ATELIER_PROJECTS: AtelierProject[] = [
  {
    id: 'proj-1',
    catalogNo: 'CATALOG NO. ID-2025-014',
    category: 'industrial',
    degree: 'M.DES INDUSTRIAL',
    title: 'Chrysalis: Deployable Prosthetic Exoskeleton',
    description: 'Low-cost, high-tenacity carbon fiber assistive limb crafted using lost-wax casting principles and topology-optimized generative skeletal nodes.',
    candidate: 'Siddharth Menon',
    advisors: 'Prof. V. Ravishankar',
    attributeLabel: 'Materiality',
    attributeValue: 'Basalt Fibre & Bio-epoxy',
    campus: 'Ahmedabad Campus',
    associatedGlyphIndex: 0
  },
  {
    id: 'proj-2',
    catalogNo: 'CATALOG NO. CD-2025-089',
    category: 'communication',
    degree: 'B.DES GRAPHIC',
    title: 'Akshara Sutra: Variable Indic Type Foundry',
    description: 'Open-source multilingual typographic framework that harmonizes 12 official scripts of the subcontinent according to rhythm, counter-spaces, and ink traps.',
    candidate: 'Devika Chandran',
    advisors: 'Tarun Deep Girdher',
    attributeLabel: 'Script Count',
    attributeValue: '12 Scripts (Unicode 15)',
    campus: 'Ahmedabad Campus',
    associatedGlyphIndex: 5
  },
  {
    id: 'proj-3',
    catalogNo: 'CATALOG NO. TX-2025-042',
    category: 'textile',
    degree: 'M.DES TEXTILE FUTURES',
    title: 'Bioluminescent Silk: Algal Dyes & Photons',
    description: 'Living wild tasar silk filaments inoculated with genetically non-pathogenic Pyrocystis fusiformis dinoflagellates that softly glow under compressive mechanical stress.',
    candidate: 'Ananya Singhania',
    advisors: 'Dr. Shimul Vyas',
    attributeLabel: 'Ecology',
    attributeValue: 'Zero Synthetic Runoff',
    campus: 'Gandhinagar Campus',
    associatedGlyphIndex: 1
  },
  {
    id: 'proj-4',
    catalogNo: 'CATALOG NO. NMD-2025-077',
    category: 'spatial',
    degree: 'M.DES NEW MEDIA',
    title: 'Bardo Simulator: Spatial Haptic Passing',
    description: 'Immersive acoustic meditation chamber that senses autonomic nervous tension via piezoelectric cushions to modify acoustic reverberation chamber geometry in VR.',
    candidate: 'Tenzin Norbu',
    advisors: 'Prof. Jignesh Khakhar',
    attributeLabel: 'Stack',
    attributeValue: 'Custom Audio Shader & Rust',
    campus: 'Bengaluru Campus',
    associatedGlyphIndex: 3
  },
  {
    id: 'proj-5',
    catalogNo: 'CATALOG NO. FD-2025-031',
    category: 'industrial',
    degree: 'B.DES FURNITURE',
    title: 'Charpai 3.0: High-Tensile Kevlar Daybed',
    description: 'Reinventing the quintessential South Asian community daybed using CNC milled reclaimed teak and self-tightening tensioned Kevlar cordage.',
    candidate: 'Aarav Joshi',
    advisors: 'Pravinsinh Solanki',
    attributeLabel: 'Joinery',
    attributeValue: 'Glueless Friction Mortise',
    campus: 'Ahmedabad Campus',
    associatedGlyphIndex: 8
  },
  {
    id: 'proj-6',
    catalogNo: 'CATALOG NO. AN-2025-055',
    category: 'communication',
    degree: 'B.DES ANIMATION FILM',
    title: 'Kite of Dharavi: Stop-Motion Charcoal',
    description: 'Frame-by-frame 18fps charcoal rotoscoping capturing the vertical architecture and informal economies of Mumbai through the poetic flight of an orphaned kite.',
    candidate: 'Meera Sanyal',
    advisors: 'Sekhar Mukherjee',
    attributeLabel: 'Runtime',
    attributeValue: '11m 42s (4K DCI)',
    campus: 'Ahmedabad Campus',
    associatedGlyphIndex: 4
  }
];

export interface ScheduleItem {
  id: string;
  dayBadge: string;
  time: string;
  title: string;
  description: string;
  badge: string;
  borderTheme: string;
}

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: 'day-1',
    dayBadge: 'DAY 01 • NOV 14',
    time: '09:30 AM — 13:00 PM IST',
    title: 'Keynote: Decolonizing the Algorithmic Loom',
    description: 'Addressing generative AI from the standpoint of artisanal handloom weavers in Maheshwar and Kanchipuram. Distribution of physical monograph folios and welcome address by the Director.',
    badge: 'Open Keynote',
    borderTheme: 'border-[#721724]'
  },
  {
    id: 'day-2',
    dayBadge: 'DAY 02 • NOV 15',
    time: '14:00 PM — 18:30 PM IST',
    title: 'Jury Review: 100 Diplomas on the Sabarmati Plinth',
    description: 'Live peer-defense and industry review of graduating Master\'s diplomas across interactive spatial pavilions. Hands-on material testing in the ceramic and rapid prototyping workshops.',
    badge: 'Delegate Access',
    borderTheme: 'border-[#D4AF37]'
  },
  {
    id: 'day-3',
    dayBadge: 'DAY 03 • NOV 16',
    time: '16:00 PM — 21:00 PM IST',
    title: 'Nocturnal Light & Sound Atelier: Riverfront Projections',
    description: '12-channel spatial projection mapping along the Tagore Memorial Hall facade celebrating experimental animation thesis and generative typography in real-time shaders.',
    badge: 'Public Admission',
    borderTheme: 'border-[#8E8271]'
  },
  {
    id: 'day-4',
    dayBadge: 'DAY 04 • NOV 17',
    time: '17:00 PM IST TILL LATE',
    title: 'Annual 45th Convocation Ceremony & Archive Unveiling',
    description: 'Conferral of undergraduate and postgraduate diplomas by Chancellor and Chief Guest, followed by archive monograph sealing and banquet under architectural brick colonnades.',
    badge: 'Graduates & Guests',
    borderTheme: 'border-[#4A0E17]'
  }
];
