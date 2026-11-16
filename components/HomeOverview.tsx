"use client";

import React from "react";
import Link from "next/link";
import { Truck, Clock, ShieldCheck, Wrench, Calendar } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomeOverview() {
  const advantages = [
    {
      icon: <Truck className="w-6 h-6 text-white" />,
      iconBg: "bg-red-600",
      cardBg: "bg-red-50 border-2 border-red-200",
      title: "$150 Flat Valley Delivery",
      desc: "Delivered direct to your jobsite anywhere in Maricopa County. Pickup included.",
    },
    {
      icon: <Clock className="w-6 h-6 text-gray-950" />,
      iconBg: "bg-[#E5A919]",
      cardBg: "bg-yellow-50 border-2 border-yellow-200",
      title: "48-Hour Free Hold",
      desc: "Lock in machine availability online without paying full fees up front.",
    },
    {
      icon: <Wrench className="w-6 h-6 text-white" />,
      iconBg: "bg-red-600",
      cardBg: "bg-red-50 border-2 border-red-200",
      title: "Maintained Heavy Fleet",
      desc: "Low-hour CAT and John Deere machinery thoroughly inspected and fueled.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-gray-950" />,
      iconBg: "bg-[#E5A919]",
      cardBg: "bg-yellow-50 border-2 border-yellow-200",
      title: "Arizona 811 Compliant",
      desc: "Paperless digital agreements signed from your phone in under 60 seconds.",
    },
  ];

  return (
    <div id="overview" className="bg-white">
      {/* 1. WHY CONTRACTORS CHOOSE US */}
      <section className="py-12 sm:py-16 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Built for Arizona Contractors &amp; Homeowners
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
              We eliminate equipment rental headaches with guaranteed upfront rates, flat delivery, and fast turnaround.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div
                  className={`rounded-3xl p-6 ${adv.cardBg} shadow-sm hover:shadow-2xl hover:-translate-y-2.5 hover:border-red-400 transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer`}
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-2xl ${adv.iconBg} flex items-center justify-center mb-4 group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300 shadow-sm`}
                    >
                      {adv.icon}
                    </div>
                    <h3 className="text-base font-black text-gray-950 mb-1.5 group-hover:text-red-700 transition-colors">
                      {adv.title}
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {adv.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-gray-500 group-hover:text-red-600 transition-colors">
                    <span>Standard Policy</span>
                    <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CTA BANNER (RED-50 CARD THEME) */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="rounded-3xl p-8 sm:p-12 bg-red-50 border-2 border-red-200 text-gray-950 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
              <div className="max-w-xl text-center lg:text-left">
                <span className="text-xs font-black uppercase tracking-widest text-red-600 mb-2 inline-block">
                  Fast Arizona Jobsite Dispatch
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-1 text-gray-950">
                  Ready to Reserve Your Equipment?
                </h2>
                <p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">
                  Put a 48-hour hold on your machine dates online or call our dispatch team directly for prompt jobsite delivery.
                </p>
              </div>

              <div className="flex flex-wrap gap-3.5 shrink-0 justify-center">
                <Link
                  href="/book-now"
                  className="btn-red px-7 py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Book Equipment Now</span>
                </Link>
                <Link
                  href="/contact"
                  className="btn-yellow px-7 py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-md hover:scale-105 transition-all text-gray-950 cursor-pointer"
                >
                  <span>Contact Dispatch</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
