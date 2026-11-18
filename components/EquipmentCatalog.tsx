"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Tag, ShieldAlert, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface MachineItem {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  category: string;
  images: string[];
  keySpecs: { label: string; val: string }[];
  daily: number;
  weekly: number;
  monthly: number;
  requiresAZ811?: boolean;
}

export default function EquipmentCatalog() {
  const machines: MachineItem[] = [
    {
      id: "cat-259d3",
      name: "CAT 259D3 Compact Track Loader",
      shortName: "CAT 259D3",
      subtitle: "Powerful, versatile, and ready for your toughest jobs. Perfect for landscaping and grading.",
      category: "Track Loader",
      images: [
        "/images/cat-ontrailer.webp",
        "/images/cat-front.webp",
        "/images/cat-side.webp",
        "/images/cat-back.webp",
      ],
      keySpecs: [
        { label: "Engine", val: "74.3 HP Turbo Diesel" },
        { label: "Operating Weight", val: "8,987 lbs (2,010 lb ROC)" },
        { label: "Operating Hours", val: "8h/d • 40h/w • 160h/mo" },
      ],
      daily: 450,
      weekly: 1300,
      monthly: 3150,
      requiresAZ811: true,
    },
    {
      id: "cat-226d3",
      name: "2021 Cat 226D3 Skid Steer Loader",
      shortName: "Cat 226D3",
      subtitle: "Enclosed cab model with AC & stereo. Compact radial-lift skid steer.",
      category: "Skid Steer",
      images: [
        "/images/equipments/2021 Cat 226D3/1.jpg",
        "/images/equipments/2021 Cat 226D3/2.jpg",
        "/images/equipments/2021 Cat 226D3/3.jpg",
        "/images/equipments/2021 Cat 226D3/4.jpg",
        "/images/equipments/2021 Cat 226D3/5.jpg",
      ],
      keySpecs: [
        { label: "Engine", val: "Cat C2.2 Diesel (67 HP)" },
        { label: "Capacity (ROC)", val: "1,550 lbs (1,650 w/ wt)" },
        { label: "Operating Weight", val: "5,850 lbs" },
      ],
      daily: 275,
      weekly: 1000,
      monthly: 1650,
      requiresAZ811: true,
    },
    {
      id: "jd-4044m",
      name: "2021 John Deere 4044M",
      shortName: "John Deere 4044M",
      subtitle: "With loader bucket and grapple attachments. Perfect for landscaping or farm work.",
      category: "Utility Tractor",
      images: ["/images/jd-4044.webp"],
      keySpecs: [
        { label: "Horsepower", val: "44 HP Yanmar Diesel" },
        { label: "Drivetrain", val: "Hydrostatic 4WD" },
        { label: "Operating Hours", val: "8h/d • 40h/w • 160h/mo" },
      ],
      daily: 300,
      weekly: 1000,
      monthly: 1700,
      requiresAZ811: false,
    },
    {
      id: "wt5c",
      name: "Multi-quip WT5C 500-gallon water trailer",
      shortName: "WT5C Water Trailer",
      subtitle: "Dust control, compaction, general water hauling.",
      category: "Water Trailer",
      images: ["/images/water-trailer.webp"],
      keySpecs: [
        { label: "Tank Capacity", val: "500-Gal Poly Tank" },
        { label: "Centrifugal Pump", val: "Honda Pump (158 GPM)" },
        { label: "Hours / Miles", val: "Unlimited Hours" },
      ],
      daily: 150,
      weekly: 450,
      monthly: 1000,
      requiresAZ811: false,
    },
    {
      id: "load-trail",
      name: "2025 Load Trail Gooseneck Deckover Trailer",
      shortName: "Load Trail Trailer",
      subtitle: "26 ft overall length with hydraulic tilt deck. Tandem 10K axles with electric brakes.",
      category: "Heavy Trailer",
      images: ["/images/cat-ontrailer.webp"],
      keySpecs: [
        { label: "Coupler", val: "2-5/16\" Gooseneck (30K Rated)" },
        { label: "Axles & GVWR", val: "Tandem 10K (20,000 lbs)" },
        { label: "Tilt Deck", val: "Hydraulic Tilt with Remote" },
      ],
      daily: 175,
      weekly: 700,
      monthly: 2300,
      requiresAZ811: false,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTier, setSelectedTier] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [selectedImgIndex, setSelectedImgIndex] = useState<{ [key: string]: number }>({
    "cat-259d3": 0,
    "cat-226d3": 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextMachine = () => {
    setCurrentIndex((prev) => (prev + 1) % machines.length);
  };

  const prevMachine = () => {
    setCurrentIndex((prev) => (prev - 1 + machines.length) % machines.length);
  };

  const currentMachine = machines[currentIndex];
  const activeImgUrl =
    currentMachine.images[selectedImgIndex[currentMachine.id] || 0] || currentMachine.images[0];

  // DISPLAY EXACTLY 3 ITEMS ONLY PER USER REQUEST TO AVOID COMPRESSED / WRAPPING UI
  const getVisibleTabs = () => {
    if (machines.length <= 3) {
      return machines.map((m, idx) => ({ ...m, origIdx: idx }));
    }
    // Determine a 3-item window that always contains currentIndex
    let start = 0;
    if (currentIndex >= 2) {
      start = Math.min(currentIndex - 1, machines.length - 3);
    }
    return machines.slice(start, start + 3).map((m, idx) => ({
      ...m,
      origIdx: start + idx,
    }));
  };

  const displayTabs = getVisibleTabs();

  return (
    <section id="Equipment" className="pt-20 sm:pt-24 pb-12 sm:pb-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER - LABELS ONLY, NO BADGES */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Our Equipment Fleet
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600 font-medium">
            Select an equipment model below for instant rates and specifications.
          </p>

          {/* COMPACT NAVIGATION: PREVIOUS (ARROW) / 3 ITEMS ONLY / NEXT (ARROW) - WHITE/TRANSPARENT BACKGROUND */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 mt-4 flex-nowrap overflow-x-auto py-1 max-w-full">
            <button
              type="button"
              onClick={prevMachine}
              className="bg-white hover:bg-gray-100 text-gray-900 border-2 border-gray-300 hover:border-gray-900 px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0"
              aria-label="Previous equipment"
            >
              <ChevronLeft className="w-4 h-4 text-gray-900" />
              <span>Previous</span>
            </button>

            {/* DISPLAY 3 ITEMS ONLY TO PREVENT COMPRESSION */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {displayTabs.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCurrentIndex(m.origIdx)}
                  className={`px-2.5 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    currentIndex === m.origIdx
                      ? "bg-red-600 text-white shadow-md scale-105"
                      : "bg-gray-100 hover:bg-yellow-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  {m.shortName}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={nextMachine}
              className="bg-white hover:bg-gray-100 text-gray-900 border-2 border-gray-300 hover:border-gray-900 px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0"
              aria-label="Next equipment"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 text-gray-950" />
            </button>
          </div>
        </ScrollReveal>

        {/* STREAMLINED CARD DESIGN (USING ADVANTAGE THEME CARDS: RED-50 & YELLOW-50) */}
        <ScrollReveal delay={100}>
          <div className="rounded-3xl bg-white border-2 border-gray-200 shadow-xl p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* LEFT: MACHINE IMAGE & ANGLE SELECTOR (NO IMAGE BORDERS, FULLSCREEN ENABLED) */}
              <div className="lg:col-span-5 space-y-3">
                <div
                  onClick={() => setIsFullscreen(true)}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center group cursor-pointer"
                  title="Click to view full screen"
                >
                  <img
                    src={activeImgUrl}
                    alt={currentMachine.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* SOLID BADGES (RED & YELLOW ACCENTS) */}
                  <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs uppercase px-3 py-1 rounded-lg shadow-md pointer-events-none">
                    {currentMachine.category}
                  </div>

                  {/* FULLSCREEN EXPAND BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFullscreen(true);
                    }}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white p-2 rounded-xl backdrop-blur-xs transition-all shadow-md group-hover:scale-110 cursor-pointer"
                    title="View Fullscreen"
                    aria-label="View Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </button>

                  <div className="absolute bottom-3 right-3 bg-[#E5A919] text-white font-black text-xs uppercase px-3 py-1.5 rounded-xl shadow-md pointer-events-none transition-all">
                    ${selectedTier === "daily" ? `${currentMachine.daily} / Day` : selectedTier === "weekly" ? `${currentMachine.weekly} / Week` : `${currentMachine.monthly} / 4-Week`}
                  </div>
                </div>

                {/* THUMBNAIL SELECTOR (NO HEAVY BORDERS, MINIMALIST INDICATOR) */}
                {currentMachine.images.length > 1 && (
                  <div className="flex gap-2 justify-center overflow-x-auto pb-1">
                    {currentMachine.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setSelectedImgIndex({
                            ...selectedImgIndex,
                            [currentMachine.id]: idx,
                          })
                        }
                        className={`relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                          (selectedImgIndex[currentMachine.id] || 0) === idx
                            ? "ring-2 ring-red-600 shadow-md scale-105"
                            : "opacity-60 hover:opacity-100 bg-slate-100"
                        }`}
                      >
                        <img src={img} alt="Angle thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: ESSENTIAL MACHINE DETAILS & PRICING */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="text-xs font-mono font-black uppercase tracking-widest text-red-600 mb-0.5">
                    Machine {currentIndex + 1} of {machines.length}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-snug">
                    {currentMachine.name}
                  </h3>
                  <p className="text-gray-600 font-medium text-xs sm:text-sm mt-1 leading-relaxed">
                    {currentMachine.subtitle}
                  </p>
                </div>

                {/* COMPACT KEY SPECS BAR (NEUTRAL CARD) */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 grid grid-cols-3 gap-2 text-center text-xs shadow-2xs">
                  {currentMachine.keySpecs.map((sp, idx) => (
                    <div key={idx} className="border-r last:border-r-0 border-slate-200 px-1">
                      <div className="text-[10px] font-bold text-gray-500 uppercase">{sp.label}</div>
                      <div className="font-black text-gray-950 text-xs sm:text-sm mt-0.5">{sp.val}</div>
                    </div>
                  ))}
                </div>

                {/* PRICING GRID (RED-50 AND YELLOW-50 CARDS AS REQUESTED) */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-900">
                      Transparent Rates • $150 Valley Delivery
                    </span>
                    <span className="bg-yellow-50 text-yellow-900 border border-yellow-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                      Zero Hidden Fees
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    {/* DAILY (INTERACTIVE BUTTON CARD) */}
                    <button
                      type="button"
                      onClick={() => setSelectedTier("daily")}
                      className={`p-2.5 rounded-2xl transition-all cursor-pointer text-center ${
                        selectedTier === "daily"
                          ? "bg-white border-2 border-red-600 ring-2 ring-red-500/20 shadow-md scale-102"
                          : "bg-white border-2 border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100 shadow-2xs"
                      }`}
                    >
                      <div className="text-[10px] font-black text-gray-500 uppercase">Daily</div>
                      <div className="text-xl sm:text-2xl font-black text-gray-950 mt-0.5">${currentMachine.daily}</div>
                      <div className="text-[10px] text-gray-500 font-bold">Includes 8h</div>
                    </button>

                    {/* WEEKLY (INTERACTIVE BUTTON CARD - RED-50) */}
                    <button
                      type="button"
                      onClick={() => setSelectedTier("weekly")}
                      className={`p-2.5 rounded-2xl transition-all cursor-pointer text-center relative ${
                        selectedTier === "weekly"
                          ? "bg-red-50 border-2 border-red-600 ring-2 ring-red-500/20 shadow-md scale-102"
                          : "bg-red-50/70 border-2 border-red-200 hover:border-red-400 shadow-2xs opacity-85 hover:opacity-100"
                      }`}
                    >
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                        Best Value
                      </span>
                      <div className="text-[10px] font-black uppercase tracking-wider text-red-700">Weekly</div>
                      <div className="text-xl sm:text-2xl font-black text-gray-950 mt-0.5">${currentMachine.weekly}</div>
                      <div className="text-[10px] text-gray-600 font-bold">Includes 40h</div>
                    </button>

                    {/* 4-WEEK (INTERACTIVE BUTTON CARD - YELLOW-50) */}
                    <button
                      type="button"
                      onClick={() => setSelectedTier("monthly")}
                      className={`p-2.5 rounded-2xl transition-all cursor-pointer text-center ${
                        selectedTier === "monthly"
                          ? "bg-yellow-50 border-2 border-yellow-600 ring-2 ring-yellow-500/20 shadow-md scale-102"
                          : "bg-yellow-50/70 border-2 border-yellow-200 hover:border-yellow-400 shadow-2xs opacity-85 hover:opacity-100"
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase tracking-wider text-yellow-800">4-Week</div>
                      <div className="text-xl sm:text-2xl font-black text-gray-950 mt-0.5">${currentMachine.monthly}</div>
                      <div className="text-[10px] text-gray-600 font-bold">Includes 160h</div>
                    </button>
                  </div>
                </div>

                {/* STATUTORY 811 NOTE (RED-50 CARD WITH RED-200 BORDER) */}
                {currentMachine.requiresAZ811 && (
                  <div className="flex items-center gap-2.5 bg-red-50 border-2 border-red-200 text-red-950 p-3 rounded-2xl text-xs font-bold">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Arizona 811 Call-Before-You-Dig safety compliance applies to this machine.</span>
                  </div>
                )}

                {/* ACTION BUTTONS (SOLID RED & YELLOW REMAIN) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <Link
                    href={`/book-now?equipment=${currentMachine.id}&tier=${selectedTier}`}
                    className="btn-red py-3.5 px-5 rounded-xl text-center text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-102 transition-all cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4 text-white" />
                    <span>
                      Book {selectedTier === "daily" ? `Daily ($${currentMachine.daily})` : selectedTier === "weekly" ? `Weekly ($${currentMachine.weekly})` : `Monthly ($${currentMachine.monthly})`}
                    </span>
                  </Link>
                  <Link
                    href="/pricing"
                    className="btn-yellow py-3.5 px-5 rounded-xl text-center text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-102 transition-all cursor-pointer"
                  >
                    <Tag className="w-4 h-4 text-gray-950" />
                    <span>View All Pricing</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
        {isFullscreen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="flex justify-between items-center text-white" onClick={(e) => e.stopPropagation()}>
              <div>
                <h4 className="font-black text-base sm:text-lg">{currentMachine.name}</h4>
                <p className="text-xs text-white/70">
                  Photo {(selectedImgIndex[currentMachine.id] || 0) + 1} of {currentMachine.images.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
                aria-label="Close fullscreen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center p-2 sm:p-4" onClick={(e) => e.stopPropagation()}>
              {currentMachine.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const cur = selectedImgIndex[currentMachine.id] || 0;
                    const prev = (cur - 1 + currentMachine.images.length) % currentMachine.images.length;
                    setSelectedImgIndex({ ...selectedImgIndex, [currentMachine.id]: prev });
                  }}
                  className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-red-600 text-white transition-all cursor-pointer shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <img
                src={activeImgUrl}
                alt={currentMachine.name}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl select-none"
              />

              {currentMachine.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const cur = selectedImgIndex[currentMachine.id] || 0;
                    const next = (cur + 1) % currentMachine.images.length;
                    setSelectedImgIndex({ ...selectedImgIndex, [currentMachine.id]: next });
                  }}
                  className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-[#E5A919] hover:text-gray-950 text-white transition-all cursor-pointer shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* BOTTOM THUMBNAILS IN LIGHTBOX */}
            {currentMachine.images.length > 1 && (
              <div className="flex gap-2 justify-center overflow-x-auto py-2" onClick={(e) => e.stopPropagation()}>
                {currentMachine.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex({ ...selectedImgIndex, [currentMachine.id]: idx })}
                    className={`w-14 h-11 rounded-lg overflow-hidden transition-all cursor-pointer ${
                      (selectedImgIndex[currentMachine.id] || 0) === idx
                        ? "ring-2 ring-red-500 scale-105"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
