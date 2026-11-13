"use client";

import React from "react";
import { AlertTriangle, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/fleet";
import ScrollReveal from "@/components/ScrollReveal";

interface FAQItem {
  q: string;
  a: string;
  highlight?: boolean;
}

export default function FAQSection() {
  const faqs: FAQItem[] = [
    {
      q: "What is the Arizona 811 requirement?",
      a: "State law (A.R.S. § 40-360.21) requires calling 811 at least 2 working days before digging. It's free and marks underground utility lines before machinery arrives.",
      highlight: true,
    },
    {
      q: "How does the $150 flat Valley delivery work?",
      a: "A flat $150 fee covers both jobsite drop-off and pickup across all of Maricopa County (Phoenix, Scottsdale, Cave Creek, Mesa, etc.).",
    },
    {
      q: "How are operating hours tracked & billed?",
      a: "Includes 8h/day, 40h/week, and 160h/month on the engine meter. Additional operating hours are billed at $75/hour.",
    },
    {
      q: "How does the 48-hour reservation hold work?",
      a: "Reserving online locks in an instant 48-hour hold on the machine, giving you time to finalize site prep and sign your agreement.",
    },
    {
      q: "What is the fuel & cleaning return policy?",
      a: "Machines arrive full and clean. Return full of fuel to avoid an $8/gal charge. Normal jobsite dust is fine; hardened concrete has a $150 wash fee.",
    },
    {
      q: "What is the security deposit & release policy?",
      a: "A $500 card authorization hold is placed at delivery dispatch and released immediately upon return inspection.",
    },
    {
      q: "Do I need insurance or a damage waiver?",
      a: "An optional 10% Physical Damage Waiver covers accidental machine damage with zero deductible. Contractors may also provide a COI.",
    },
  ];

  return (
    <section id="faq" className="py-12 sm:py-16 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Frequently Asked Questions &amp; Policies
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-medium">
            Clear, straightforward policies covering equipment operations, Arizona digging laws, and rental deposits.
          </p>
        </ScrollReveal>

        {/* OPEN DISPLAY GRID - NO CLICKING OR ACCORDION NEEDED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {faqs.map((faq, idx) => (
            <ScrollReveal key={idx} delay={idx * 60}>
              <div
                className={`p-5 rounded-2xl h-full border-2 transition-all shadow-xs ${
                  faq.highlight
                    ? "bg-red-50 border-red-300 md:col-span-2"
                    : "bg-slate-50 border-slate-200 hover:border-yellow-400"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {faq.highlight && (
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-gray-950">
                      {faq.q}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* DIRECT HELP CARD (FILLED RED CONTAINER) */}
        <ScrollReveal delay={150} className="mt-10">
          <div className="rounded-3xl p-6 sm:p-8 bg-red-50 border-2 border-red-200 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
            <div>
              <h3 className="font-black text-base text-gray-950">
                Have a specific equipment or jobsite question?
              </h3>
              <p className="text-xs text-gray-700 mt-1 font-medium">
                Speak directly with our equipment dispatch team in Cave Creek / Phoenix.
              </p>
            </div>
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="btn-red px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 flex-shrink-0 shadow-md hover:scale-105 transition-all"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>Call {COMPANY_INFO.phone}</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
