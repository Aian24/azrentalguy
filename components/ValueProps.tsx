import React from "react";
import { Wrench, MapPin, FileCheck2, CalendarClock } from "lucide-react";

export default function ValueProps() {
  const values = [
    {
      icon: <Wrench className="w-6 h-6 text-brand-gold" />,
      title: "Commercial-Grade Fleet",
      desc: "Low-hour CAT & John Deere machinery serviced before every job.",
    },
    {
      icon: <MapPin className="w-6 h-6 text-brand-gold" />,
      title: "$150 Flat Valley Delivery",
      desc: "Prompt delivery & pickup across all Maricopa County job sites.",
    },
    {
      icon: <CalendarClock className="w-6 h-6 text-brand-gold" />,
      title: "48-Hour Free Hold",
      desc: "Lock in machine availability online with zero high upfront fees.",
    },
    {
      icon: <FileCheck2 className="w-6 h-6 text-brand-gold" />,
      title: "Arizona 811 Compliant",
      desc: "Legally compliant digital agreements signed in under 60 seconds.",
    },
  ];

  return (
    <div className="bg-industrial-950 border-b border-industrial-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <div className="bg-industrial-900 border border-industrial-700 p-2.5 rounded-lg flex-shrink-0">
                {v.icon}
              </div>
              <div>
                <div className="text-white font-black text-sm tracking-tight">{v.title}</div>
                <div className="text-industrial-400 text-xs mt-0.5">{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

