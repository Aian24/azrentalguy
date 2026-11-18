"use client";

import React, { useState, useEffect } from "react";
import { FLEET, EquipmentItem } from "@/lib/fleet";
import {
  CalendarCheck,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  X,
  Camera,
  CheckCircle2,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomeFleetShowcase() {
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);

  // In-card photo carousel index state per machine ID
  const [cardImgIndex, setCardImgIndex] = useState<{ [id: string]: number }>({});

  // Fullscreen Lightbox modal state
  const [lightboxMachine, setLightboxMachine] = useState<EquipmentItem | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number>(0);

  // Responsive visible count tracking (2 on desktop & tablet, 1 on mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else {
        setVisibleCount(2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, FLEET.length - visibleCount);

  // Auto-play timer: advances through equipment every 4.5 seconds, pauses on hover
  useEffect(() => {
    if (isPaused || lightboxMachine !== null) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, lightboxMachine, maxIndex]);

  const nextSlide = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const openLightbox = (machine: EquipmentItem, idx: number = 0) => {
    setLightboxMachine(machine);
    setLightboxIdx(idx);
  };

  const closeLightbox = () => {
    setLightboxMachine(null);
    setLightboxIdx(0);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxMachine) return;

    const images =
      lightboxMachine.images && lightboxMachine.images.length > 0
        ? lightboxMachine.images
        : [lightboxMachine.imageUrl];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        setLightboxIdx((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        setLightboxIdx((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxMachine]);

  const handleSelectAndScroll = (e: React.MouseEvent, machineId: string) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("select-equipment", { detail: machineId }));
      const el = document.getElementById("Booknow");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "#Booknow");
      }
    }
  };

  return (
    <section
      id="Equipment"
      className="scroll-mt-20 sm:scroll-mt-24 py-12 sm:py-16 bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Our Equipment
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600 font-medium">
            Commercial machinery serviced, fully fueled, and ready for fast Valley jobsite dispatch.
          </p>
        </ScrollReveal>

        {/* 2-CARD CAROUSEL SLIDER WRAPPER WITH ARROWS & AUTO-PLAY */}
        <div
          className="relative px-2 sm:px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT NAV ARROW */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Equipment"
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-gray-300 text-gray-900 hover:border-red-600 hover:text-red-600 shadow-xl flex items-center justify-center transition-all cursor-pointer group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* RIGHT NAV ARROW */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Equipment"
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-gray-300 text-gray-900 hover:border-red-600 hover:text-red-600 shadow-xl flex items-center justify-center transition-all cursor-pointer group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* SLIDER VIEWPORT */}
          <div className="overflow-hidden py-2">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${startIndex * (100 / visibleCount)}%)`,
              }}
            >
              {FLEET.map((machine) => {
                const images =
                  machine.images && machine.images.length > 0
                    ? machine.images
                    : [machine.imageUrl];
                const activeImgIdx = (cardImgIndex[machine.id] || 0) % images.length;
                const currentImgUrl = images[activeImgIdx];

                return (
                  <div
                    key={machine.id}
                    className="w-full md:w-1/2 px-3 sm:px-4 shrink-0 flex flex-col"
                  >
                    {/* ORIGINAL POLISHED CARD CONTAINER - 2 EQUIPMENT PER ROW FOR MAXIMUM VISIBILITY */}
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 sm:p-6 hover:border-red-600 transition-all duration-200 shadow-sm hover:shadow-xl flex flex-col justify-between h-full group">
                      <div>
                        {/* IN-CARD PHOTO DISPLAY - CLICKABLE FOR FULLSCREEN SPECS & PHOTOS */}
                        <div
                          onClick={() => openLightbox(machine, activeImgIdx)}
                          className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 h-56 sm:h-64 lg:h-72 w-full mb-3.5 flex items-center justify-center cursor-pointer group/img"
                          title="Click to view full specifications and photos"
                        >
                          <img
                            src={currentImgUrl}
                            alt={`${machine.name} photo`}
                            className={`w-full h-full ${machine.id === "jd-4044m"
                              ? "object-contain p-3"
                              : "object-cover"
                              } group-hover/img:scale-105 transition-transform duration-300`}
                          />

                          {/* HOVER OVERLAY LABEL: VIEW FULL SPECIFICATIONS & PHOTOS */}
                          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center pointer-events-none z-10">
                            <div className="bg-white/95 text-gray-950 font-black text-xs sm:text-sm px-4 py-2 rounded-full shadow-2xl border border-white/80 flex items-center gap-2 transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-200">
                              <Maximize2 className="w-4 h-4 text-red-600" />
                              <span>View Full Specifications & Photos</span>
                            </div>
                            <span className="text-[11px] text-white/95 font-bold mt-1.5 drop-shadow-md">
                              Click image for full screen view
                            </span>
                          </div>

                          {/* IN-CARD CAROUSEL ARROWS */}
                          {images.length > 1 && (
                            <>
                              <button
                                type="button"
                                aria-label="Previous Photo"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardImgIndex((prev) => ({
                                    ...prev,
                                    [machine.id]: (activeImgIdx - 1 + images.length) % images.length,
                                  }));
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center shadow-md transition-all cursor-pointer"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>

                              <button
                                type="button"
                                aria-label="Next Photo"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardImgIndex((prev) => ({
                                    ...prev,
                                    [machine.id]: (activeImgIdx + 1) % images.length,
                                  }));
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center shadow-md transition-all cursor-pointer"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </>
                          )}

                          {/* CATEGORY BADGE */}
                          <div className="absolute top-3 left-3 z-20">
                            <span className="bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                              {machine.category}
                            </span>
                          </div>

                          {/* EXPAND LIGHTBOX BUTTON */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openLightbox(machine, activeImgIdx);
                            }}
                            className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-xl shadow-sm border border-gray-200 transition-all cursor-pointer hover:scale-105"
                            title="Open full specifications and photo gallery"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>

                          {/* DAILY RATE PILL */}
                          <div className="absolute bottom-3 right-3 z-20 bg-white/95 border border-gray-200 text-gray-950 font-black text-xs uppercase px-3 py-1 rounded-xl shadow-md pointer-events-none">
                            ${machine.dailyRate} / day
                          </div>
                        </div>

                        {/* MACHINE NAME */}
                        <h3
                          title={machine.name}
                          className="text-lg sm:text-xl font-black text-gray-950 leading-tight group-hover:text-red-600 transition-colors"
                        >
                          {machine.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium truncate mt-1">
                          {machine.tagline}
                        </p>

                        {/* COMPACT RATES BAR */}
                        <div className="mt-3 p-2.5 bg-white border border-slate-200 rounded-xl grid grid-cols-2 gap-3 text-center shadow-2xs">
                          <div className="border-r border-slate-100 pr-1">
                            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                              Daily Rate
                            </span>
                            <span className="text-base sm:text-lg font-black text-gray-950">
                              ${machine.dailyRate}
                            </span>
                            <span className="block text-xs text-gray-500 font-semibold">
                              Includes 8h
                            </span>
                          </div>
                          <div className="pl-1">
                            <span className="block text-[11px] font-black text-red-600 uppercase tracking-wider">
                              Weekly Rate
                            </span>
                            <span className="text-base sm:text-lg font-black text-red-600">
                              ${machine.weeklyRate}
                            </span>
                            <span className="block text-xs text-gray-500 font-semibold">
                              Includes 40h
                            </span>
                          </div>
                        </div>

                        {/* KEY TECHNICAL SPECS DIRECTLY ON CARD - HIGH VISIBILITY */}
                        <div className="mt-3.5 pt-3 border-t border-slate-200/90 space-y-1.5">
                          <div className="flex items-center justify-between text-xs sm:text-sm bg-slate-100/80 rounded-xl px-3 py-2 border border-slate-200/70">
                            <span className="text-gray-600 font-bold shrink-0">Engine / Power:</span>
                            <span className="text-gray-950 font-black text-right ml-2 truncate">
                              {machine.engineSpecs}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm bg-slate-100/80 rounded-xl px-3 py-2 border border-slate-200/70">
                            <span className="text-gray-600 font-bold shrink-0">Weight / Cap:</span>
                            <span className="text-gray-950 font-black text-right ml-2 truncate">
                              {machine.operatingWeight}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm bg-slate-100/80 rounded-xl px-3 py-2 border border-slate-200/70">
                            <span className="text-gray-600 font-bold shrink-0">Included Hours:</span>
                            <span className="text-gray-950 font-black text-right ml-2 truncate">
                              {machine.includedHours}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM ACTION BUTTON - FULL WIDTH */}
                      <div className="mt-4 pt-3 border-t border-slate-200/80">
                        <a
                          href="#Booknow"
                          onClick={(e) => handleSelectAndScroll(e, machine.id)}
                          className="btn-red w-full py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-sm hover:scale-101 transition-all cursor-pointer whitespace-nowrap"
                        >
                          <CalendarCheck className="w-4 h-4 text-white" />
                          <span>Book Now</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DOTS & AUTO-PLAY STATUS INDICATOR */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setStartIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${idx === startIndex
                  ? "w-8 h-2.5 bg-red-600"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-400 font-semibold">
            {isPaused ? "Auto-play paused on hover" : "Auto-playing • Click arrows to browse"}
          </span>
        </div>
      </div>

      {/* FULLSCREEN EQUIPMENT DETAILS & PHOTO LIGHTBOX MODAL */}
      {lightboxMachine && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* MODAL HEADER */}
          <div
            className="flex items-center justify-between text-white border-b border-white/15 pb-3 max-w-7xl mx-auto w-full shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="bg-red-600 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                {lightboxMachine.category}
              </span>
              <div>
                <h3 className="text-base sm:text-2xl font-black text-white leading-tight">
                  {lightboxMachine.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-medium hidden sm:block">
                  {lightboxMachine.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="#Booknow"
                onClick={(e) => {
                  closeLightbox();
                  handleSelectAndScroll(e, lightboxMachine.id);
                }}
                className="btn-red py-2 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
              >
                <CalendarCheck className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Book This Equipment</span>
                <span className="sm:hidden">Book Now</span>
              </a>

              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* MAIN 2-COLUMN MODAL CONTENT: LEFT PHOTOS & RIGHT FULL SPECS (SAME HEIGHT) */}
          <div
            className="flex-1 max-w-7xl mx-auto w-full my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch lg:h-[78vh] lg:min-h-[580px] lg:max-h-[760px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LEFT COLUMN: INTERACTIVE PHOTO VIEWER (DIRECT GRID CELL - EXACT MATCHING HEIGHT) */}
            {(() => {
              const images =
                lightboxMachine.images && lightboxMachine.images.length > 0
                  ? lightboxMachine.images
                  : [lightboxMachine.imageUrl];
              const activeLightboxIdx = lightboxIdx % images.length;

              return (
                <div className="lg:col-span-7 bg-slate-950/70 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl h-full min-h-0">
                  {/* PHOTO STAGE */}
                  <div className="relative flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={images[activeLightboxIdx]}
                      alt={`${lightboxMachine.name} photo ${activeLightboxIdx + 1}`}
                      className={`max-h-full max-w-full rounded-xl shadow-2xl transition-all duration-200 ${
                        lightboxMachine.id === "jd-4044m"
                          ? "object-contain bg-white/5 p-4"
                          : "object-contain"
                      }`}
                    />

                    {/* PHOTO ARROWS */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Previous Photo"
                          onClick={() =>
                            setLightboxIdx(
                              (prev) => (prev - 1 + images.length) % images.length
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-xl border border-white/20 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                          type="button"
                          aria-label="Next Photo"
                          onClick={() =>
                            setLightboxIdx((prev) => (prev + 1) % images.length)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-xl border border-white/20 transition-all cursor-pointer"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* PHOTO COUNTER */}
                    {images.length > 1 && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                        Photo {activeLightboxIdx + 1} of {images.length}
                      </div>
                    )}
                  </div>

                  {/* THUMBNAIL STRIP DOCKED INSIDE AT BOTTOM OF LEFT CARD */}
                  {images.length > 1 && (
                    <div className="flex justify-center gap-2 overflow-x-auto pt-3 mt-3 border-t border-white/10 shrink-0 w-full">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setLightboxIdx(i)}
                          className={`w-14 sm:w-16 h-10 sm:h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                            i === activeLightboxIdx
                              ? "border-red-600 scale-105 shadow-md"
                              : "border-white/20 opacity-50 hover:opacity-100"
                          }`}
                        >
                          <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* RIGHT COLUMN: COMPLETE SPECIFICATIONS & PRICING SHEET (EXACT MATCHING HEIGHT) */}
            <div className="lg:col-span-5 bg-white text-gray-950 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between h-full border-2 border-slate-200 w-full min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
                {/* RATES SUMMARY BAR */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-3 gap-2 text-center shadow-2xs">
                  <div className="border-r border-slate-200 pr-1">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Daily Rate
                    </span>
                    <span className="text-base sm:text-lg font-black text-gray-950">
                      ${lightboxMachine.dailyRate}
                    </span>
                    <span className="block text-[10px] text-gray-500 font-semibold">
                      Includes 8h
                    </span>
                  </div>
                  <div className="border-r border-slate-200 pr-1">
                    <span className="block text-[10px] font-black text-red-600 uppercase tracking-wider">
                      Weekly Rate
                    </span>
                    <span className="text-base sm:text-lg font-black text-red-600">
                      ${lightboxMachine.weeklyRate}
                    </span>
                    <span className="block text-[10px] text-gray-500 font-semibold">
                      Includes 40h
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      4-Week Rate
                    </span>
                    <span className="text-base sm:text-lg font-black text-gray-950">
                      ${lightboxMachine.monthlyRate}
                    </span>
                    <span className="block text-[10px] text-gray-500 font-semibold">
                      {lightboxMachine.category.includes("Trailer") ? "Unlimited" : "Includes 160h"}
                    </span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                  {lightboxMachine.description}
                </p>

                {/* FULL FACTORY SPECIFICATIONS TABLE (EXACT FROM AZRENTALGUY.COM) */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-950 mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
                    <span>Full Technical Specifications</span>
                    <span className="text-[10px] text-red-600 font-bold lowercase tracking-normal">verified azrentalguy.com</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {(lightboxMachine.fullSpecs || [
                      { label: "Engine / Power", value: lightboxMachine.engineSpecs },
                      { label: "Operating Weight", value: lightboxMachine.operatingWeight },
                      { label: "Included Hours", value: lightboxMachine.includedHours },
                      { label: "Overtime Rate", value: `$${lightboxMachine.overtimeRate}.00 / hr` },
                    ]).map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors"
                      >
                        <span className="text-gray-500 font-bold shrink-0">{spec.label}</span>
                        <span className="text-gray-950 font-black text-right ml-2">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KEY INCLUDED FEATURES */}
                {lightboxMachine.keyFeatures && lightboxMachine.keyFeatures.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-950 mb-2 border-b border-slate-200 pb-1">
                      Included Equipment & Features
                    </h4>
                    <ul className="space-y-1 text-xs">
                      {lightboxMachine.keyFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AVAILABLE ATTACHMENTS */}
                {lightboxMachine.availableAttachments && lightboxMachine.availableAttachments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-950 mb-2 border-b border-slate-200 pb-1">
                      Available Attachments
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      {lightboxMachine.availableAttachments.map((att, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-100"
                        >
                          <span className="font-bold text-gray-900">{att.name}</span>
                          <span className="font-black text-red-600">
                            +${att.dailyPrice}/day • +${att.weeklyPrice}/wk
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTON IN MODAL */}
              <div className="mt-4 pt-3 border-t border-slate-200 shrink-0">
                <a
                  href="#Booknow"
                  onClick={(e) => {
                    closeLightbox();
                    handleSelectAndScroll(e, lightboxMachine.id);
                  }}
                  className="btn-red w-full py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-md hover:scale-101 transition-all cursor-pointer whitespace-nowrap"
                >
                  <CalendarCheck className="w-4 h-4 text-white" />
                  <span>Reserve This Equipment Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
