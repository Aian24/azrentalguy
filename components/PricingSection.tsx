"use client";

import React from "react";
import Link from "next/link";
import { Check, Truck, Clock, ShieldCheck, Fuel } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function PricingSection() {
  const priceCards = [
    {
      name: "CAT 259D3 Track Loader",
      category: "Heavy Machinery",
      daily: 450,
      weekly: 1300,
      monthly: 3150,
      hours: "8h / 40h / 160h",
      popular: true,
      features: [
        "74.3 HP Turbo Diesel Engine",
        "Rubber Tracks (Low Ground Pressure)",
        "Overtime billed at $75.00 / hour",
        "Pallet forks & Gannon attachments available",
      ],
    },
    {
      name: "2021 Cat 226D3 Skid Steer",
      category: "Skid Steer Loader",
      daily: 275,
      weekly: 1000,
      monthly: 1650,
      hours: "8h / 40h / 160h",
      popular: false,
      features: [
        "Enclosed Cab with AC & Stereo",
        "Cat C2.2 Diesel Engine (67 HP)",
        "1,550 lb Rated Operating Capacity",
        "Compact radial lift for tight residential access",
      ],
    },
    {
      name: "John Deere 4044M Tractor",
      category: "Utility Tractor",
      daily: 300,
      weekly: 1000,
      monthly: 1700,
      hours: "8h / 40h / 160h",
      popular: false,
      features: [
        "Front-End Heavy Loader Bucket included",
        "4-Wheel Drive with Differential Lock",
        "Overtime billed at $75.00 / hour",
        "Gannon box scraper available (+$50/d)",
      ],
    },
    {
      name: "Multi-Quip WT5C Water Trailer",
      category: "Dust Control & Compaction",
      daily: 150,
      weekly: 450,
      monthly: 1000,
      hours: "Unlimited Operating Hours",
      popular: false,
      features: [
        "500-Gallon Poly Storage Tank",
        "Honda Centrifugal Pump & Spray Bars",
        "Fire Hose & Quick Connect Nozzle",
        "DOT Highway Approved Dual Axles",
      ],
    },
    {
      name: "2025 Load Trail Gooseneck",
      category: "Deckover Hauler",
      daily: 175,
      weekly: 700,
      monthly: 2300,
      hours: "Unlimited Miles & Hours",
      popular: false,
      features: [
        "Dual 10,000 lb Dexter Axles (20k GVWR)",
        "Monster Spring Flip-Over Ramps",
        "Perimeter Tie-Down D-Rings",
        "Suitable for CAT 259D3 & Tractors",
      ],
    },
  ];

  return (
    <section id="Pricing" className="py-12 sm:py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER - NO BADGE PER USER REQUEST */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Transparent Rental Pricing
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
            Straightforward daily, weekly, and 4-week rates. Serviced, fueled, and backed by $150 flat Valley delivery.
          </p>
        </ScrollReveal>

        {/* PRICING CARDS GRID (RED-50 & YELLOW-50 CARDS THEMED LIKE HOME OVERVIEW) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {priceCards.map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 80}>
              <div
                className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 h-full shadow-sm hover:shadow-xl ${
                  item.popular
                    ? "border-2 border-red-200 bg-red-50"
                    : "border-2 border-yellow-200 bg-yellow-50"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider ${
                        item.popular ? "text-red-700" : "text-yellow-800"
                      }`}
                    >
                      {item.category}
                    </span>
                    {item.popular && (
                      <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        Best Value
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-gray-950 leading-snug">{item.name}</h3>

                  {/* PRICE DISPLAY */}
                  <div className="mt-3 pt-3 border-t border-gray-200/80 flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-black text-gray-950">${item.daily}</span>
                    <span className="text-xs font-bold ml-1.5 text-gray-600">/ day</span>
                  </div>
                  <div className="text-xs font-bold mt-1 text-gray-700">
                    Included: <span className="font-extrabold text-gray-950">{item.hours}</span>
                  </div>

                  {/* MULTI-TIER BREAKDOWN (WHITE CARD) */}
                  <div className="mt-4 bg-white p-3 rounded-2xl border border-gray-200 text-xs space-y-1.5 shadow-2xs">
                    <div className="flex justify-between font-bold text-gray-700">
                      <span>Weekly Rate:</span>
                      <strong className="text-red-600 font-black">${item.weekly}</strong>
                    </div>
                    <div className="flex justify-between font-bold text-gray-700">
                      <span>4-Week Rate:</span>
                      <strong className="text-gray-950 font-black">${item.monthly}</strong>
                    </div>
                  </div>

                  {/* FEATURES */}
                  <ul className="mt-4 space-y-2 text-xs text-gray-700 font-medium">
                    {item.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ACTION BUTTON (SOLID COLOR PER USER RULE) */}
                <div className="pt-5 mt-auto">
                  <Link
                    href="/book-now"
                    className={`w-full py-3 rounded-2xl text-center text-xs font-black uppercase tracking-wider block transition-all shadow-md hover:scale-102 ${
                      item.popular ? "btn-red" : "btn-yellow"
                    }`}
                  >
                    Book This Machine
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* ADDITIONAL POLICIES CARDS (FILLED WITH RICH ACCENT COLORS) */}
        <ScrollReveal delay={150} className="mt-12">
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-50 border-2 border-gray-200 shadow-md">
            <div className="border-b border-gray-200 pb-3 mb-5 flex flex-wrap justify-between items-center gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-950">Rental Terms &amp; Policies</h3>
                <p className="text-xs text-gray-500">Standard operational guidelines across all equipment rentals.</p>
              </div>
              <span className="bg-red-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-xs">
                Valley-Wide Policy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 font-black text-sm text-gray-950 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span>$150 Delivery &amp; Pickup</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Flat $150 delivery and pickup fee covers all job sites across Maricopa County.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 font-black text-sm text-gray-950 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#E5A919] text-white flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>$75.00 / Hour Overtime</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Included: 8h/day, 40h/week, 160h/4-week. Excess hours billed on return meter check.
                </p>
              </div>

              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 font-black text-sm text-gray-950 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>10% Physical Damage Waiver</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Optional waiver covers accidental machine damage with zero deductible.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 font-black text-sm text-gray-950 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#E5A919] text-white flex items-center justify-center">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <span>Fuel &amp; Cleanliness Terms</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Delivered full; return full or billed at $8/gal. Excessive mud incurs $150 wash fee.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
