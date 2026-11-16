"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Truck, Clock, ShieldCheck, Fuel, Tag, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function PricingSection() {
  const [activeTier, setActiveTier] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const priceCards = [
    {
      id: "cat-259d3",
      name: "CAT 259D3 Track Loader",
      category: "Heavy Machinery",
      daily: 450,
      weekly: 1300,
      monthly: 3150,
      hours: "8h / 40h / 160h",
      popular: true,
      features: [
        "74.3 HP Turbo Diesel Engine",
        "Low Ground Pressure Rubber Tracks",
        "Overtime Rate: $75.00 / hour",
        "Pallet Forks & Box Scraper Available",
      ],
    },
    {
      id: "cat-226d3",
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
        "Compact Radial Lift for Tight Spaces",
      ],
    },
    {
      id: "jd-4044m",
      name: "John Deere 4044M Tractor",
      category: "Utility Tractor",
      daily: 300,
      weekly: 1000,
      monthly: 1700,
      hours: "8h / 40h / 160h",
      popular: false,
      features: [
        "Heavy Front-End Loader Bucket Included",
        "4-Wheel Drive with Differential Lock",
        "Overtime Rate: $75.00 / hour",
        "Gannon Box Scraper Available (+$50/d)",
      ],
    },
    {
      id: "wt5c",
      name: "Multi-Quip WT5C Water Trailer",
      category: "Dust Control & Water",
      daily: 150,
      weekly: 450,
      monthly: 1000,
      hours: "Unlimited Operating Hours",
      popular: false,
      features: [
        "500-Gallon Poly Storage Tank",
        "Honda Centrifugal Pump & Spray Bars",
        "Fire Hose & Quick-Connect Nozzle",
        "DOT Highway Approved Dual Axles",
      ],
    },
    {
      id: "deckover-trailer",
      name: "2025 Load Trail Gooseneck",
      category: "Deckover Equipment Hauler",
      daily: 175,
      weekly: 700,
      monthly: 2300,
      hours: "Unlimited Miles & Hours",
      popular: false,
      features: [
        "Dual 10,000 lb Dexter Axles (20k GVWR)",
        "Monster Spring Flip-Over Ramps",
        "Heavy Perimeter Tie-Down D-Rings",
        "Fits CAT 259D3, 226D3 & Tractors",
      ],
    },
  ];

  return (
    <section id="Pricing" className="py-12 sm:py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Transparent Rental Pricing
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
            Straightforward daily, weekly, and 4-week rates. Serviced, fueled, and backed by $150 flat Valley delivery.
          </p>
        </ScrollReveal>

        {/* INTERACTIVE BILLING DURATION SWITCHER (SEGMENTED TABS) */}
        <ScrollReveal delay={50} className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200 inline-flex items-center gap-1 sm:gap-2 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTier("daily")}
              className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTier === "daily"
                  ? "bg-white text-gray-950 shadow-md border border-slate-300 scale-102"
                  : "text-gray-600 hover:text-gray-950 hover:bg-slate-200/70"
              }`}
            >
              Daily Rate (8h)
            </button>
            <button
              type="button"
              onClick={() => setActiveTier("weekly")}
              className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTier === "weekly"
                  ? "bg-red-600 text-white shadow-md scale-102"
                  : "text-gray-600 hover:text-gray-950 hover:bg-slate-200/70"
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span>Weekly (Best Value)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTier("monthly")}
              className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTier === "monthly"
                  ? "bg-white text-gray-950 shadow-md border border-slate-300 scale-102"
                  : "text-gray-600 hover:text-gray-950 hover:bg-slate-200/70"
              }`}
            >
              4-Week Monthly (160h)
            </button>
          </div>
        </ScrollReveal>

        {/* INTERACTIVE PRICING CARDS (SPACIOUS 3-COL & 2-COL CENTERED LAYOUT WITH HOVER & ACTIVE STATES) */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {priceCards.map((item, idx) => {
            const currentPrice =
              activeTier === "daily"
                ? item.daily
                : activeTier === "weekly"
                ? item.weekly
                : item.monthly;

            const unitLabel =
              activeTier === "daily"
                ? "/ day"
                : activeTier === "weekly"
                ? "/ week"
                : "/ 4-wk";

            const hoursLabel =
              activeTier === "daily"
                ? item.hours.includes("Unlimited")
                  ? "Unlimited Hours"
                  : "Includes 8h"
                : activeTier === "weekly"
                ? item.hours.includes("Unlimited")
                  ? "Unlimited Hours"
                  : "Includes 40h"
                : item.hours.includes("Unlimited")
                ? "Unlimited Hours"
                : "Includes 160h";

            // Calculate potential savings vs pure daily
            const weeklySavings = item.daily * 7 - item.weekly;
            const monthlySavings = item.daily * 28 - item.monthly;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-md flex"
              >
                <ScrollReveal delay={idx * 60} className="w-full flex">
                  <div
                    className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 w-full shadow-sm hover:shadow-2xl hover:-translate-y-2 cursor-pointer group ${
                      item.popular
                        ? "border-2 border-red-300 hover:border-red-500 bg-red-50"
                        : "border-2 border-yellow-300 hover:border-yellow-500 bg-yellow-50"
                    }`}
                  >
                    <div>
                      {/* CATEGORY & BEST VALUE BADGE */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                            item.popular ? "text-red-700 group-hover:text-red-800" : "text-yellow-800 group-hover:text-yellow-900"
                          }`}
                        >
                          {item.category}
                        </span>
                        {item.popular && (
                          <span className="bg-red-600 text-white font-black text-[11px] uppercase px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap animate-pulse">
                            Best Value
                          </span>
                        )}
                      </div>

                      {/* MACHINE NAME */}
                      <h3 className="text-xl font-black text-gray-950 leading-tight whitespace-nowrap group-hover:text-red-600 transition-colors">
                        {item.name}
                      </h3>

                      {/* DYNAMIC RATE HERO DISPLAY (ANIMATES ON TIER CHANGE) */}
                      <div className="mt-3.5 pt-3.5 border-t border-gray-200/80 flex items-baseline justify-between gap-2 whitespace-nowrap">
                        <div className="flex items-baseline whitespace-nowrap">
                          <span className="text-3xl sm:text-4xl font-black text-gray-950 transition-all duration-200">
                            ${currentPrice.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold ml-1.5 text-gray-600">
                            {unitLabel}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-800 bg-white/95 border border-gray-200 px-2.5 py-1 rounded-xl whitespace-nowrap shadow-2xs group-hover:border-gray-400 transition-colors">
                          {hoursLabel}
                        </span>
                      </div>

                      {/* DYNAMIC SAVINGS PILL (WHEN WEEKLY OR MONTHLY SELECTED) */}
                      {activeTier === "weekly" && weeklySavings > 0 && (
                        <div className="mt-2.5 bg-emerald-100/90 border border-emerald-300 text-emerald-950 px-3 py-1 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs">
                          <span>Tier Savings:</span>
                          <span className="text-emerald-700 font-black">Save ${weeklySavings.toLocaleString()} vs daily</span>
                        </div>
                      )}

                      {activeTier === "monthly" && monthlySavings > 0 && (
                        <div className="mt-2.5 bg-emerald-100/90 border border-emerald-300 text-emerald-950 px-3 py-1 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs">
                          <span>Tier Savings:</span>
                          <span className="text-emerald-700 font-black">Save ${monthlySavings.toLocaleString()} vs daily</span>
                        </div>
                      )}

                      {/* INTERACTIVE MULTI-TIER BUTTON TIERS (CLICK TO SWITCH TIER) */}
                      <div className="mt-4 bg-white p-2.5 rounded-2xl border border-gray-200 shadow-2xs space-y-1.5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                          Click to compare rates
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTier("daily");
                            }}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${
                              activeTier === "daily"
                                ? "bg-red-50 border-2 border-red-500 shadow-xs scale-102"
                                : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            <span className="block text-[10px] font-bold text-gray-500 uppercase">Daily</span>
                            <span className="text-sm font-black text-gray-950">${item.daily}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTier("weekly");
                            }}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${
                              activeTier === "weekly"
                                ? "bg-red-50 border-2 border-red-500 shadow-xs scale-102"
                                : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            <span className="block text-[10px] font-black text-red-600 uppercase">Weekly</span>
                            <span className="text-sm font-black text-red-600">${item.weekly}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTier("monthly");
                            }}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${
                              activeTier === "monthly"
                                ? "bg-yellow-50 border-2 border-yellow-500 shadow-xs scale-102"
                                : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            <span className="block text-[10px] font-bold text-gray-500 uppercase">4-Week</span>
                            <span className="text-sm font-black text-gray-950">${item.monthly}</span>
                          </button>
                        </div>
                      </div>

                      {/* FEATURES LIST (WITH INTERACTIVE HOVER HIGHLIGHT) */}
                      <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-gray-800 font-medium">
                        {item.features.map((feat, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2.5 whitespace-nowrap group/item hover:text-gray-950 transition-colors"
                          >
                            <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                            </div>
                            <span className="whitespace-nowrap">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* ACTION BUTTON (DYNAMICALLY SHOWS ACTIVE TIER PRICE & ANIMATES ON CARD HOVER) */}
                    <div className="pt-6 mt-auto">
                      <Link
                        href={`/book-now?equipment=${item.id}&tier=${activeTier}`}
                        className={`w-full py-3.5 rounded-xl text-center text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group-hover:scale-103 group-hover:shadow-lg ${
                          item.popular ? "btn-red" : "btn-yellow"
                        }`}
                      >
                        <span>Book {activeTier === "daily" ? "Daily" : activeTier === "weekly" ? "Weekly" : "Monthly"} (${currentPrice.toLocaleString()})</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            );
          })}
        </div>

        {/* ADDITIONAL POLICIES CARDS (INTERACTIVE HOVER LIFT) */}
        <ScrollReveal delay={150} className="mt-14">
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
              <div className="p-4 bg-red-50 border-2 border-red-200 hover:border-red-400 rounded-2xl shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer group">
                <div className="flex items-center gap-2 font-black text-sm text-gray-950 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="whitespace-nowrap group-hover:text-red-700 transition-colors">$150 Delivery &amp; Pickup</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Flat $150 delivery and pickup fee covers all job sites across Maricopa County.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 hover:border-yellow-400 rounded-2xl shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer group">
                <div className="flex items-center gap-2 font-black text-sm text-gray-950 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#E5A919] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="whitespace-nowrap group-hover:text-yellow-800 transition-colors">$75.00 / Hour Overtime</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Included: 8h/day, 40h/week, 160h/4-week. Excess hours billed on return meter check.
                </p>
              </div>

              <div className="p-4 bg-red-50 border-2 border-red-200 hover:border-red-400 rounded-2xl shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer group">
                <div className="flex items-center gap-2 font-black text-sm text-gray-950 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="whitespace-nowrap group-hover:text-red-700 transition-colors">10% Damage Waiver</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Optional waiver covers accidental machine damage with zero deductible.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 hover:border-yellow-400 rounded-2xl shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer group">
                <div className="flex items-center gap-2 font-black text-sm text-gray-950 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#E5A919] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <span className="whitespace-nowrap group-hover:text-yellow-800 transition-colors">Fuel &amp; Cleanliness</span>
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
