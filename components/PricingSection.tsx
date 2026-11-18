"use client";

import React, { useState } from "react";
import { Check, Truck, Clock, ShieldCheck, Fuel, Tag, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function PricingSection() {
  const [activeTier, setActiveTier] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [activeCategory, setActiveCategory] = useState<"machinery" | "trailers" | "all">("machinery");

  const priceCards = [
    {
      id: "cat-259d3",
      name: "CAT 259D3 Compact Track Loader",
      category: "Track Loader",
      isTrailer: false,
      daily: 450,
      weekly: 1300,
      monthly: 3150,
      hours: "8h / 40h / 160h included",
      popular: true,
      features: [
        "74.3 HP Turbo Diesel Engine",
        "2,010 lb ROC (8,987 lb Operating Weight)",
        "Overtime Rate: $75.00 / hour",
        "Pallet Forks Available (+$50/d, +$100/w)",
      ],
    },
    {
      id: "jd-4044m",
      name: "2021 John Deere 4044M",
      category: "Utility Tractor",
      isTrailer: false,
      daily: 300,
      weekly: 1000,
      monthly: 1700,
      hours: "8h / 40h / 160h included",
      popular: false,
      features: [
        "44 HP Yanmar Diesel Engine",
        "Hydrostatic 4WD with Differential Lock",
        "Loader Bucket & Grapple Included",
        "Gannon Box Scraper Available (+$50/d)",
      ],
    },
    {
      id: "cat-226d3",
      name: "2021 Cat 226D3 Skid Steer Loader",
      category: "Skid Steer",
      isTrailer: false,
      daily: 275,
      weekly: 1000,
      monthly: 1650,
      hours: "8h / 40h / 160h included",
      popular: false,
      features: [
        "Enclosed Cab with AC & Stereo",
        "Cat C2.2 Diesel Engine (67 HP)",
        "1,550 lb Rated Operating Capacity",
        "Compact Radial Lift for Tight Spaces",
      ],
    },
    {
      id: "wt5c",
      name: "Multi-quip WT5C 500-gallon water trailer",
      category: "Water Trailer",
      isTrailer: true,
      daily: 150,
      weekly: 450,
      monthly: 1000,
      hours: "Unlimited Operating Hours",
      popular: false,
      features: [
        "500-Gallon Poly Storage Tank",
        "Honda Centrifugal Pump (158 GPM)",
        "Rear Spray Bar, Hose & Washdown",
        "DOT Highway Approved Dual Axles",
      ],
    },
    {
      id: "load-trail",
      name: "2025 Load Trail Gooseneck Deckover Trailer",
      category: "Heavy Trailer",
      isTrailer: true,
      daily: 175,
      weekly: 700,
      monthly: 2300,
      hours: "Unlimited Miles & Hours",
      popular: false,
      features: [
        "26 ft Deck with Hydraulic Tilt",
        "Tandem 10,000 lb Dexter Axles (20k GVWR)",
        "2-5/16\" Gooseneck Ball (30K Rated)",
        "16 Heavy Tie-Down D-Rings",
      ],
    },
  ];

  const filteredCards = priceCards.filter((card) => {
    if (activeCategory === "machinery") return !card.isTrailer;
    if (activeCategory === "trailers") return card.isTrailer;
    return true;
  });

  const handleBookPricing = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("select-equipment", { detail: itemId }));
      const el = document.getElementById("Booknow");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "#Booknow");
      }
    }
  };

  return (
    <section
      id="Pricing"
      className="scroll-mt-20 sm:scroll-mt-24 py-12 sm:py-16 bg-white border-b border-gray-200"
    >
      {/* SAME WIDTH AS OTHER SECTIONS: MAX-W-7XL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Transparent Rental Pricing
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
            Straightforward daily, weekly, and 4-week rates with transparent terms and no hidden fees.
          </p>
        </ScrollReveal>

        {/* CATEGORY SELECTOR TABS (ENSURES 3 CARDS IN ONE ROW ON DEFAULT) */}
        <ScrollReveal delay={50} className="flex justify-center mb-8">
          <div className="bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200 inline-flex items-center gap-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveCategory("machinery")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === "machinery"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-950 hover:bg-slate-200/70"
              }`}
            >
              Earthmoving Fleet (3)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("trailers")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === "trailers"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-950 hover:bg-slate-200/70"
              }`}
            >
              Commercial Trailers (2)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-950 hover:bg-slate-200/70"
              }`}
            >
              All Equipment (5)
            </button>
          </div>
        </ScrollReveal>

        {/* RESTORED RICH CARD UI FROM SCREENSHOT */}
        <div
          className={`grid gap-6 lg:gap-8 items-stretch ${
            filteredCards.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {filteredCards.map((item, idx) => {
            const currentPrice =
              activeTier === "daily"
                ? item.daily
                : activeTier === "weekly"
                ? item.weekly
                : item.monthly;

            const dailyUncapped = item.daily * (activeTier === "weekly" ? 7 : 28);
            const savings =
              activeTier === "weekly"
                ? dailyUncapped - item.weekly
                : activeTier === "monthly"
                ? dailyUncapped - item.monthly
                : 0;

            return (
              <ScrollReveal key={item.id} delay={idx * 80}>
                <div
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-full transition-all duration-200 border-2 group ${
                    item.popular
                      ? "bg-red-50/40 border-red-500 shadow-xl"
                      : "bg-white border-yellow-300 shadow-sm hover:border-yellow-500 hover:shadow-lg"
                  }`}
                >
                  {/* POPULAR BADGE */}
                  {item.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Tag className="w-3 h-3 text-white fill-white" />
                        <span>Most Popular</span>
                      </span>
                    </div>
                  )}

                  <div>
                    {/* CATEGORY & MACHINE NAME */}
                    <div className="text-[11px] font-black uppercase tracking-wider text-yellow-800 mb-1">
                      {item.category}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-950 tracking-tight leading-snug">
                      {item.name}
                    </h3>

                    {/* DYNAMIC RATE DISPLAY */}
                    <div className="mt-4 pb-4 border-b border-gray-100 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                          ${currentPrice.toLocaleString()}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-gray-500">
                          /{activeTier === "daily" ? "day" : activeTier === "weekly" ? "week" : "4-week"}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold bg-slate-100 text-gray-700 px-2 py-0.5 rounded-md">
                        {item.hours}
                      </span>
                    </div>

                    {/* TIER SAVINGS PILL */}
                    <div className="mt-2.5 flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-500">Tier Savings:</span>
                      {savings > 0 ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                          Save ${savings.toLocaleString()} vs daily
                        </span>
                      ) : (
                        <span className="text-gray-500 font-semibold text-[11px]">Standard Daily Rate</span>
                      )}
                    </div>

                    {/* IN-CARD INTERACTIVE RATE COMPARISON BOX */}
                    <div className="mt-5 p-3 rounded-2xl bg-white border border-gray-200 shadow-2xs">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider text-center mb-2">
                        Click to Compare Rates
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveTier("daily")}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            activeTier === "daily"
                              ? "bg-red-50 border-2 border-red-600 shadow-xs scale-102"
                              : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          <span className="block text-[10px] font-bold text-gray-500 uppercase">Daily</span>
                          <span className="text-sm font-black text-gray-950">${item.daily}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTier("weekly")}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            activeTier === "weekly"
                              ? "bg-red-50 border-2 border-red-600 shadow-xs scale-102"
                              : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          <span className="block text-[10px] font-black text-red-600 uppercase">Weekly</span>
                          <span className="text-sm font-black text-red-600">${item.weekly}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTier("monthly")}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            activeTier === "monthly"
                              ? "bg-red-50 border-2 border-red-600 shadow-xs scale-102"
                              : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          <span className="block text-[10px] font-bold text-gray-500 uppercase">4-Week</span>
                          <span className="text-sm font-black text-gray-950">${item.monthly}</span>
                        </button>
                      </div>
                    </div>

                    {/* FEATURES LIST WITH CHECKMARKS */}
                    <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-gray-800 font-medium">
                      {item.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ACTION BUTTON */}
                  <div className="pt-6 mt-auto">
                    <a
                      href="#Booknow"
                      onClick={(e) => handleBookPricing(e, item.id)}
                      className={`w-full py-3.5 rounded-xl text-center text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group-hover:scale-102 cursor-pointer ${
                        item.popular ? "btn-red text-white" : "btn-yellow text-gray-950"
                      }`}
                    >
                      <span>
                        Book {activeTier === "daily" ? "Daily" : activeTier === "weekly" ? "Weekly" : "Monthly"} (${currentPrice.toLocaleString()})
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* POLICIES BAR */}
        <ScrollReveal delay={150} className="mt-12">
          <div className="rounded-2xl p-5 bg-slate-50 border-2 border-slate-200 text-center flex flex-wrap justify-around items-center gap-4 text-xs font-bold text-gray-700">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-red-600 shrink-0" />
              <span>$150 Flat Valley-Wide Delivery &amp; Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600 shrink-0" />
              <span>Includes 8h/day, 40h/wk, 160h/mo</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Optional 10% Zero-Deductible Damage Waiver</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
