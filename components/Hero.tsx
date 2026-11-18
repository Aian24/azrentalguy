"use client";

import React from "react";
import { CalendarCheck, ChevronDown, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/fleet";
import ScrollReveal from "@/components/ScrollReveal";

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col justify-center items-center pt-24 sm:pt-28 pb-12 text-white px-4 sm:px-6 lg:px-8 border-b border-gray-200 overflow-hidden"
    >
      {/* BACKGROUND FLEET IMAGE - FULLY VISIBLE & NO BLUR */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/hero-fleet-banner.jpg"
          alt="AZ Rental Guy Equipment Fleet - CAT Compact Track Loader, John Deere Tractor, Skid Steer & Trailers"
          className="w-full h-full object-cover object-center"
        />
        {/* SUBTLE DARK OVERLAY FOR MAXIMUM WHITE FONT CONTRAST (NO BLUR) */}
        <div className="absolute inset-0 bg-black/40 sm:bg-black/35" />
      </div>

      {/* CENTERED CONTENT - WHITE FONT COLOR & NO BOX */}
      <div className="relative z-10 max-w-4xl mx-auto my-auto text-center flex flex-col items-center">
        {/* PUNCHY WORKHORSE HEADLINE (WHITE FONT) */}
        <ScrollReveal delay={50}>
          <h1 className="font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.12] mb-3 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
            Professional Equipment Rental{" "}
            <span className="text-[#CA021E] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              Direct to Your Jobsite.
            </span>
          </h1>
        </ScrollReveal>

        {/* CONCISE SUBTITLE (WHITE FONT) */}
        <ScrollReveal delay={100}>
          <p className="text-white/95 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-7 font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Commercial track loaders, skid steers, utility tractors, and heavy trailers in Maricopa County. Upfront transparent rates with instant 48-hour reservation holds.
          </p>
        </ScrollReveal>

        {/* WORKHORSE DIRECT ACTION BUTTONS (SOLID RED & YELLOW) */}
        <ScrollReveal delay={150}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <a
              href="#Booknow"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("Booknow");
              }}
              className="btn-red w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-xl active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck className="w-4 h-4 text-white" />
              <span>Book Equipment</span>
            </a>

            <a
              href="#Equipment"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("Equipment");
              }}
              className="btn-yellow w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-xl active:scale-95 cursor-pointer whitespace-nowrap text-gray-950"
            >
              <span>Explore Fleet</span>
              <ChevronDown className="w-4 h-4 text-gray-950" />
            </a>

            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider bg-white/95 hover:bg-white text-gray-950 transition-all cursor-pointer whitespace-nowrap shadow-xl"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
          </div>
        </ScrollReveal>
      </div>

      {/* BOUNCE SCROLL INDICATOR */}
      <div className="relative z-10 mt-6 sm:mt-8">
        <a
          href="#Equipment"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("Equipment");
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 border border-gray-200 text-xs font-black uppercase tracking-wider text-gray-900 hover:text-red-600 shadow-lg transition-all group cursor-pointer"
        >
          <span>Scroll to Equipment</span>
          <ChevronDown className="w-4 h-4 text-red-600 group-hover:translate-y-0.5 transition-transform animate-bounce" />
        </a>
      </div>
    </section>
  );
}
