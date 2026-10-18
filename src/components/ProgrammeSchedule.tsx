import { useState } from 'react';
import { SCHEDULE_ITEMS } from '../data/artifacts';

export function ProgrammeSchedule() {
  const [expandedDay, setExpandedDay] = useState<string | null>('day-1');

  const toggleDay = (id: string) => {
    setExpandedDay(expandedDay === id ? null : id);
  };

  return (
    <section id="programme" className="py-24 bg-[#0D0A09] border-b border-[#8E8271]/20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#8E8271]/20 pb-4 gap-4">
          <div>
            <span className="font-mono text-xs text-[#8A1829] uppercase tracking-widest">
              [ITINERARY // NOV 14–17, 2025]
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase text-[#FAF8F5] mt-2">
              Colloquium &amp; Symposium Schedule
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8E8271]">
            LOCATION: IGDTUW AUDITORIUM &amp; LIVE METAVERSE STREAM
          </div>
        </div>

        {/* Timeline Schedule Items */}
        <div className="space-y-4 font-mono text-xs">
          {SCHEDULE_ITEMS.map((item) => {
            const isExpanded = expandedDay === item.id;
            return (
              <div
                key={item.id}
                onClick={() => toggleDay(item.id)}
                className={`p-6 bg-[#141110] border-l-2 ${item.borderTheme} hover:bg-[#1C1615] transition-all cursor-pointer group`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="md:w-52 font-bold text-[#EDE7DC]">
                    <span className="text-[#721724] block text-sm group-hover:text-[#8A1829] transition-colors">
                      {item.dayBadge}
                    </span>
                    <span className="text-[11px] text-[#8E8271]">{item.time}</span>
                  </div>
                  <div className="flex-1 font-serif text-base text-[#EDE7DC]">
                    <strong className="font-display font-bold text-[#FAF8F5] block text-base font-sans mb-1 group-hover:text-[#F5F2EB] transition-colors">
                      {item.title}
                    </strong>
                    <div className="text-sm text-[#CFC2AC] leading-relaxed">
                      {isExpanded ? item.description : item.description.slice(0, 90) + '...'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-right">
                    <span className="px-3 py-1 bg-black/60 border border-[#8E8271]/20 text-[#CFC2AC] uppercase text-[10px]">
                      {item.badge}
                    </span>
                    <span className="text-[#8E8271] text-base group-hover:translate-x-1 transition-transform">
                      {isExpanded ? '↑' : '↓'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#8E8271]/15 flex flex-wrap justify-between items-center text-[11px] text-[#8E8271]">
                    <span>RECORDING: BROADCASTED TO HYBRID ARCHIVE</span>
                    <span className="text-[#D4AF37]">DELEGATE CHECK-IN AT DESK B</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Campus Logistics Spec */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
          <div className="p-5 bg-[#141110] border border-[#8E8271]/20">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#8E8271] block mb-1">
              THE VENUE
            </span>
            <span className="font-display text-lg text-white block mb-1">IGDTUW Delhi Campus</span>
            <p className="text-xs text-[#CFC2AC]">Auditorium &amp; Innovation Labs, Kashmere Gate Heritage Campus, Delhi.</p>
          </div>
          <div className="p-5 bg-[#141110] border border-[#8E8271]/20">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#8E8271] block mb-1">
              HOURS OF OPERATION
            </span>
            <span className="font-display text-lg text-white block mb-1">09:00 — 21:00 IST</span>
            <p className="text-xs text-[#CFC2AC]">Morning session doors open 08:30 AM. Evening exhibitions open to public.</p>
          </div>
          <div className="p-5 bg-[#141110] border border-[#8E8271]/20">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#8E8271] block mb-1">
              TRANSIT &amp; METRO
            </span>
            <span className="font-display text-lg text-white block mb-1">Kashmere Gate Metro</span>
            <p className="text-xs text-[#CFC2AC]">Gate No. 7 located 250m from campus north gate (Red, Yellow &amp; Violet lines).</p>
          </div>
          <div className="p-5 bg-[#141110] border border-[#8E8271]/20">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#8E8271] block mb-1">
              HOST ENTITY
            </span>
            <span className="font-display text-lg text-white block mb-1">Nirvana Society</span>
            <p className="text-xs text-[#CFC2AC]">Design &amp; Technology Society, Indira Gandhi Delhi Technological University.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
