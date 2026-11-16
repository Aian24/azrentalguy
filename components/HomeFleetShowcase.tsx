"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FLEET, EquipmentItem } from "@/lib/fleet";
import {
  CalendarCheck,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  X,
  Camera,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomeFleetShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // In-card photo carousel index state per machine ID
  const [cardImgIndex, setCardImgIndex] = useState<{ [id: string]: number }>({});

  // Fullscreen Lightbox modal state
  const [lightboxMachine, setLightboxMachine] = useState<EquipmentItem | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number>(0);

  const categories = [
    { label: "All Fleet", val: "All", count: 5 },
    { label: "Track Loaders", val: "Track Loader", count: 1 },
    { label: "Skid Steers", val: "Skid Steer", count: 1 },
    { label: "Utility Tractors", val: "Utility Tractor", count: 1 },
    { label: "Commercial Trailers", val: "Trailer", count: 2 },
  ];

  const filteredFleet = FLEET.filter((item) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Trailer") {
      return item.category === "Water Trailer" || item.category === "Heavy Trailer";
    }
    return item.category === activeCategory;
  });

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

  return (
    <section id="fleet-showcase" className="py-10 sm:py-14 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Our Equipment Fleet
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600 font-medium">
            Commercial machinery serviced, fully fueled, and delivered anywhere in Maricopa County for $150 flat.
          </p>
        </ScrollReveal>

        {/* INTERACTIVE CATEGORY FILTER TABS */}
        <ScrollReveal delay={50} className="flex justify-center mb-8 overflow-x-auto py-1">
          <div className="bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200 inline-flex items-center gap-1.5 shadow-xs shrink-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.val;
              return (
                <button
                  key={cat.val}
                  type="button"
                  onClick={() => setActiveCategory(cat.val)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-red-600 text-white shadow-md scale-102"
                      : "text-gray-600 hover:text-gray-950 hover:bg-slate-200/70"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-white/25 text-white" : "bg-slate-200 text-gray-600"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* COMPACT & UNIFORM FLEET CARDS (EXACT SAME HEIGHT, ALIGNED BUTTONS) */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {filteredFleet.map((machine, idx) => {
            const machineImages =
              machine.images && machine.images.length > 0
                ? machine.images
                : [machine.imageUrl];
            const currentImgIdx = (cardImgIndex[machine.id] ?? 0) % machineImages.length;
            const currentImg = machineImages[currentImgIdx];
            const hasMultipleImages = machineImages.length > 1;

            return (
              <div
                key={machine.id}
                className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-sm flex"
              >
                <ScrollReveal delay={idx * 60} className="w-full flex">
                  <div className="rounded-3xl p-5 bg-slate-50 border-2 border-slate-200 hover:border-red-500 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between w-full h-full group">
                    {/* TOP CONTENT */}
                    <div>
                      {/* IN-CARD PHOTO CAROUSEL BOX */}
                      <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900 mb-3.5 select-none">
                        {/* CURRENT PHOTO */}
                        <img
                          src={currentImg}
                          alt={`${machine.name} - Photo ${currentImgIdx + 1} of ${machineImages.length}`}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                          onClick={() => openLightbox(machine, currentImgIdx)}
                        />

                        {/* CATEGORY BADGE */}
                        <span className="absolute top-2.5 left-2.5 bg-red-600 text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-lg shadow-md pointer-events-none z-10">
                          {machine.category}
                        </span>

                        {/* STATUS BADGE */}
                        {machine.badge && (
                          <span className="absolute top-2.5 right-11 bg-[#E5A919] text-gray-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-lg shadow-md pointer-events-none z-10">
                            {machine.badge}
                          </span>
                        )}

                        {/* FULLSCREEN LIGHTBOX TRIGGER BUTTON */}
                        <button
                          type="button"
                          aria-label="View Fullscreen Photo"
                          title="View Fullscreen Photo"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLightbox(machine, currentImgIdx);
                          }}
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition-all z-10 cursor-pointer shadow-md hover:scale-110"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        {/* IN-CARD CAROUSEL ARROWS (WHEN MULTIPLE IMAGES) */}
                        {hasMultipleImages && (
                          <>
                            <button
                              type="button"
                              aria-label="Previous image"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardImgIndex((prev) => ({
                                  ...prev,
                                  [machine.id]:
                                    (currentImgIdx - 1 + machineImages.length) %
                                    machineImages.length,
                                }));
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-110 shadow-md z-10 cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              aria-label="Next image"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardImgIndex((prev) => ({
                                  ...prev,
                                  [machine.id]:
                                    (currentImgIdx + 1) % machineImages.length,
                                }));
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-110 shadow-md z-10 cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* PHOTO COUNTER PILL (BOTTOM-LEFT) */}
                        {hasMultipleImages && (
                          <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md pointer-events-none z-10">
                            <Camera className="w-3 h-3 text-[#E5A919]" />
                            <span>
                              {currentImgIdx + 1}/{machineImages.length}
                            </span>
                          </div>
                        )}

                        {/* PAGINATION DOTS (BOTTOM-CENTER) */}
                        {hasMultipleImages && (
                          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/55 backdrop-blur-xs px-2 py-1 rounded-full z-10 pointer-events-none">
                            {machineImages.map((_, dotIdx) => (
                              <span
                                key={dotIdx}
                                className={`block rounded-full transition-all duration-200 ${
                                  dotIdx === currentImgIdx
                                    ? "w-3 h-1.5 bg-[#E5A919]"
                                    : "w-1.5 h-1.5 bg-white/60"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* DAILY RATE PILL (BOTTOM-RIGHT) */}
                        <div className="absolute bottom-2.5 right-2.5 bg-white/95 border border-gray-200 backdrop-blur-xs text-gray-950 font-black text-xs uppercase px-2.5 py-1 rounded-xl shadow-md pointer-events-none z-10">
                          ${machine.dailyRate} / day
                        </div>
                      </div>

                      {/* MACHINE NAME - CLEAN & COMPACT (1 LINE TRUNCATE FOR UNIFORM HEIGHT) */}
                      <h3
                        title={machine.name}
                        className="text-lg font-black text-gray-950 leading-tight whitespace-nowrap truncate group-hover:text-red-600 transition-colors"
                      >
                        {machine.name}
                      </h3>

                      {/* COMPACT RATES BAR (EXACT FIXED HEIGHT ACROSS ALL CARDS) */}
                      <div className="mt-3 p-2.5 bg-white border border-slate-200 rounded-2xl grid grid-cols-2 gap-2 text-center shadow-2xs">
                        <div className="border-r border-slate-100 pr-1">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Daily Rate
                          </span>
                          <span className="text-base font-black text-gray-950">
                            ${machine.dailyRate}
                          </span>
                          <span className="block text-[10px] text-gray-500 font-semibold">
                            Includes 8h
                          </span>
                        </div>
                        <div className="pl-1">
                          <span className="block text-[10px] font-black text-red-600 uppercase tracking-wider">
                            Weekly Rate
                          </span>
                          <span className="text-base font-black text-red-600">
                            ${machine.weeklyRate}
                          </span>
                          <span className="block text-[10px] text-gray-500 font-semibold">
                            Includes 40h
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM ACTION BUTTONS - ALIGNED AT THE EXACT SAME HORIZONTAL HEIGHT */}
                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-2">
                      <Link
                        href={`/book-now?equipment=${machine.id}`}
                        className="btn-red flex-1 py-3 px-3 rounded-xl text-center text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-1.5 shadow-sm hover:scale-102 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 text-white" />
                        <span>Book Now</span>
                      </Link>

                      <Link
                        href="/equipment"
                        className="px-3 py-3 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 hover:border-gray-900 transition-all inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
                        title="View all photos & technical specs"
                      >
                        <span>Specs</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            );
          })}
        </div>

        {/* BOTTOM FLEET LINK */}
        <ScrollReveal delay={100} className="text-center mt-10">
          <Link
            href="/equipment"
            className="btn-yellow inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-md hover:scale-105 transition-all text-gray-950"
          >
            <span>Explore Full Multi-Angle Fleet &amp; Lightbox</span>
            <ArrowRight className="w-4 h-4 text-gray-950" />
          </Link>
        </ScrollReveal>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxMachine && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* LIGHTBOX HEADER */}
          <div
            className="flex items-center justify-between text-white max-w-6xl mx-auto w-full pb-2 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  {lightboxMachine.category}
                </span>
                <h3 className="text-base sm:text-xl font-black text-white">
                  {lightboxMachine.name}
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                High-Resolution Photo Gallery • Use arrow keys or click thumbnails
              </p>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* LIGHTBOX MAIN IMAGE & PREV/NEXT BUTTONS */}
          <div
            className="relative flex-1 flex items-center justify-center my-3 max-w-6xl mx-auto w-full select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const images =
                lightboxMachine.images && lightboxMachine.images.length > 0
                  ? lightboxMachine.images
                  : [lightboxMachine.imageUrl];
              const activeLightboxIdx = lightboxIdx % images.length;

              return (
                <>
                  {images.length > 1 && (
                    <button
                      type="button"
                      aria-label="Previous Lightbox Image"
                      onClick={() =>
                        setLightboxIdx(
                          (prev) => (prev - 1 + images.length) % images.length
                        )
                      }
                      className="absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-xl border border-white/20"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}

                  <div className="relative max-h-[65vh] sm:max-h-[70vh] flex items-center justify-center">
                    <img
                      src={images[activeLightboxIdx]}
                      alt={`${lightboxMachine.name} - Photo ${activeLightboxIdx + 1}`}
                      className="max-h-[65vh] sm:max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg border border-white/15">
                      {activeLightboxIdx + 1} / {images.length}
                    </div>
                  </div>

                  {images.length > 1 && (
                    <button
                      type="button"
                      aria-label="Next Lightbox Image"
                      onClick={() =>
                        setLightboxIdx((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-xl border border-white/20"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </>
              );
            })()}
          </div>

          {/* LIGHTBOX FOOTER / THUMBNAILS & CTA */}
          <div
            className="max-w-6xl mx-auto w-full pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* THUMBNAILS ROW */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
              {(() => {
                const images =
                  lightboxMachine.images && lightboxMachine.images.length > 0
                    ? lightboxMachine.images
                    : [lightboxMachine.imageUrl];

                return images.map((thumbUrl, tIdx) => {
                  const isActive = tIdx === lightboxIdx % images.length;
                  return (
                    <button
                      key={tIdx}
                      type="button"
                      onClick={() => setLightboxIdx(tIdx)}
                      className={`relative w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-[#CA021E] scale-105 shadow-md"
                          : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
                      }`}
                    >
                      <img
                        src={thumbUrl}
                        alt={`Thumbnail ${tIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                });
              })()}
            </div>

            {/* ACTION CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-white text-xs sm:text-sm font-bold">
                From ${lightboxMachine.dailyRate}/day
              </span>
              <Link
                href={`/book-now?equipment=${lightboxMachine.id}`}
                onClick={closeLightbox}
                className="btn-red py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
              >
                <CalendarCheck className="w-4 h-4 text-white" />
                <span>Book This Machine</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
