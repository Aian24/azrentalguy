"use client";

import React from "react";
import Link from "next/link";
import { CalendarCheck, Tag } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface PageHeroProps {
  title: string;
  highlightText?: string;
  subtitle: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export default function PageHero({
  title,
  highlightText,
  subtitle,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: PageHeroProps) {
  return (
    <section className="bg-white border-b border-gray-200 pt-16 pb-8 sm:pt-20 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* TITLE - LABELS & TEXTS ONLY (CENTERED) */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 tracking-tight leading-[1.15] text-center">
            {title}{" "}
            {highlightText && (
              <span className="text-red-600">{highlightText}</span>
            )}
          </h1>

          {/* SUBTITLE */}
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-medium max-w-2xl text-center mx-auto">
            {subtitle}
          </p>

          {/* ACTION BUTTONS (CENTERED) */}
          {(primaryCtaText || secondaryCtaText) && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {primaryCtaText && primaryCtaHref && (
                <Link
                  href={primaryCtaHref}
                  className="btn-red px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-md hover:scale-102 transition-all"
                >
                  <CalendarCheck className="w-4 h-4 text-white" />
                  <span>{primaryCtaText}</span>
                </Link>
              )}

              {secondaryCtaText && secondaryCtaHref && (
                <Link
                  href={secondaryCtaHref}
                  className="btn-yellow px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-md hover:scale-102 transition-all"
                >
                  <Tag className="w-4 h-4 text-gray-950" />
                  <span>{secondaryCtaText}</span>
                </Link>
              )}
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
