"use client";

import React from "react";
import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/fleet";
import ScrollReveal from "@/components/ScrollReveal";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full pt-24 sm:pt-28 pb-8 sm:pb-10 bg-white text-gray-950 px-4 sm:px-6 lg:px-8 border-b border-gray-200"
    >
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* PUNCHY WORKHORSE HEADLINE */}
        <ScrollReveal>
          <h1 className="font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.12] mb-3 text-gray-950">
            Heavy Equipment Rental{" "}
            <span className="text-[#CA021E]">
              Direct to Your Jobsite.
            </span>
          </h1>
        </ScrollReveal>

        {/* CONCISE SUBTITLE */}
        <ScrollReveal delay={50}>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
            Commercial track loaders, skid steers, utility tractors, and heavy trailers in Maricopa County. Upfront transparent rates with instant 48-hour reservation holds.
          </p>
        </ScrollReveal>

        {/* WORKHORSE DIRECT ACTION BUTTONS (SOLID RED & YELLOW) */}
        <ScrollReveal delay={100}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href="/book-now"
              className="btn-red w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck className="w-4 h-4 text-white" />
              <span>Book Equipment Online</span>
            </Link>

            <a
              href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
              className="btn-yellow w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95 cursor-pointer whitespace-nowrap text-gray-950"
            >
              <Phone className="w-4 h-4 text-gray-950" />
              <span>Call Dispatch: {COMPANY_INFO.phone}</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
