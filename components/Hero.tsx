"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CalendarCheck, Truck } from "lucide-react";
import HeroScrollIndicator from "@/components/HeroScrollIndicator";

const HOMEPAGE_VIDEOS = ["/videos/hero-1.mp4", "/videos/hero-2.mp4"];

export default function Hero() {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRefs = [videoRef0, videoRef1];

  useEffect(() => {
    const currentRef = videoRefs[activeVideoIdx].current;
    if (currentRef) {
      currentRef.currentTime = 0;
      currentRef.playbackRate = 0.75;
      currentRef.play().catch(() => {});
    }
  }, [activeVideoIdx]);

  const handleVideoEnded = () => {
    setActiveVideoIdx((prev) => (prev + 1) % HOMEPAGE_VIDEOS.length);
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[85vh] sm:min-h-screen flex flex-col justify-center items-center pt-24 pb-16 bg-black text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      {/* 1. DUAL HD BACKGROUND VIDEOS */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {HOMEPAGE_VIDEOS.map((src, idx) => (
          <video
            key={src}
            ref={videoRefs[idx]}
            src={src}
            autoPlay={idx === 0}
            muted
            playsInline
            onEnded={handleVideoEnded}
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 0.75;
            }}
            onPlay={(e) => {
              e.currentTarget.playbackRate = 0.75;
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 brightness-90 contrast-105 ${
              activeVideoIdx === idx ? "opacity-100 z-1" : "opacity-0 z-0"
            }`}
          />
        ))}

        {/* LIGHT CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-black/45 z-2" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-2" />
      </div>

      {/* 2. MINIMALIST HIGH-IMPACT HERO CONTENT */}
      <div className="relative z-10 max-w-3xl mx-auto text-center my-auto flex flex-col items-center">
        {/* PUNCHY HEADLINE */}
        <h1 className="font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          Equipment Rental{" "}
          <span className="text-[#E5A919] drop-shadow-[0_4px_24px_rgba(229,169,25,0.4)]">
            Valley-Wide.
          </span>
        </h1>

        {/* CONCISE SUBTITLE */}
        <p className="text-white/90 text-base sm:text-xl max-w-xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-medium">
          Delivered direct to your jobsite. Simple &amp; reliable.
        </p>

        {/* RED & YELLOW BUTTONS - NON-ARROW ICONS PER USER REQUEST */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/book-now"
            className="btn-red inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-xl active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <CalendarCheck className="w-4 h-4 text-white" />
            <span>Book Equipment</span>
          </Link>

          <Link
            href="/equipment"
            className="btn-yellow inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-xl active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Truck className="w-4 h-4 text-gray-950" />
            <span>View Fleet</span>
          </Link>
        </div>
      </div>

      {/* 3. SCROLL DOWN INDICATOR */}
      <HeroScrollIndicator targetId="featured-equipment" accentColor="#E5A919" />
    </section>
  );
}
