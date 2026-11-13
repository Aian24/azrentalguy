"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface HeroScrollIndicatorProps {
  targetId?: string;
  accentColor?: string;
  className?: string;
}

export default function HeroScrollIndicator({
  targetId,
  accentColor = "#E5A919",
  className = "",
}: HeroScrollIndicatorProps) {
  const handleClick = () => {
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-all cursor-pointer group ${className}`}
      aria-label="Scroll down to equipment fleet"
    >
      <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
        Scroll Down
      </span>
      <div className="w-8 h-8 rounded-full bg-black/40 border border-white/30 backdrop-blur-xs flex items-center justify-center group-hover:border-[#E5A919] group-hover:scale-110 transition-all shadow-md">
        <ChevronDown className="w-4 h-4 text-[#E5A919] animate-bounce" />
      </div>
    </button>
  );
}

