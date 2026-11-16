"use client";

import React, { useState } from "react";
import { MapPin, CheckCircle, Truck, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/fleet";
import ScrollReveal from "@/components/ScrollReveal";

export default function ServiceAreaMap() {
  const [zipInput, setZipInput] = useState("");
  const [zipStatus, setZipStatus] = useState<null | {
    covered: boolean;
    city?: string;
    message: string;
  }>(null);

  const handleCheckZip = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = zipInput.trim();

    if (!cleanZip || cleanZip.length !== 5 || !/^\d+$/.test(cleanZip)) {
      setZipStatus({
        covered: false,
        message: "Please enter a valid 5-digit Arizona zip code.",
      });
      return;
    }

    const prefix = cleanZip.substring(0, 3);
    if (["850", "852", "853"].includes(prefix)) {
      setZipStatus({
        covered: true,
        message: `Zip Code ${cleanZip} is in our primary Valley Service Zone! $150 flat-rate delivery & pickup confirmed.`,
      });
    } else {
      setZipStatus({
        covered: true,
        message: `Zip Code ${cleanZip} is serviceable! Please call (707) 326-5592 for customized regional delivery dispatch.`,
      });
    }
  };

  const cities = [
    { name: "Phoenix", region: "Central & North Valley", zip: "85001" },
    { name: "Cave Creek & Carefree", region: "North Valley / Foothills", zip: "85331" },
    { name: "Scottsdale", region: "East Valley", zip: "85254" },
    { name: "Paradise Valley", region: "Central East", zip: "85253" },
    { name: "Mesa & Chandler", region: "Southeast Valley", zip: "85201" },
    { name: "Gilbert & Queen Creek", region: "Southeast Valley", zip: "85234" },
    { name: "Glendale & Peoria", region: "West Valley", zip: "85301" },
    { name: "Surprise & Sun City", region: "Northwest Valley", zip: "85374" },
    { name: "Goodyear & Buckeye", region: "Southwest Valley", zip: "85326" },
    { name: "Anthem & New River", region: "North I-17 Corridor", zip: "85086" },
  ];

  return (
    <section id="delivery" className="py-12 sm:py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT: DELIVERY INFORMATION */}
          <ScrollReveal className="lg:col-span-7 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Valley-Wide Equipment Delivery For Just{" "}
              <span className="text-red-600">$150 Flat</span>.
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
              Don&apos;t waste project hours borrowing trailers and hitching equipment. AZ Rental Guy delivers clean, fully fueled heavy machinery directly to your jobsite gate or driveway and picks it up when your rental concludes.
            </p>

            {/* CITIES SERVED GRID (INTERACTIVE CLICKABLE BADGES) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {cities.map((c, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setZipInput(c.zip);
                    setZipStatus({
                      covered: true,
                      city: c.name,
                      message: `Zip Code ${c.zip} (${c.name}) is in our primary Valley Service Zone! $150 flat-rate delivery & pickup confirmed.`,
                    });
                  }}
                  className="bg-yellow-50/80 border border-yellow-200 hover:border-red-600 hover:scale-103 hover:shadow-md p-3 rounded-xl text-xs transition-all cursor-pointer shadow-2xs group"
                  title={`Click to test delivery for ${c.name} (${c.zip})`}
                >
                  <div className="font-black text-gray-950 flex items-center gap-1.5 group-hover:text-red-700 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span>{c.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-700 font-bold mt-0.5">{c.region}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* RIGHT: ZIP CODE CHECKER CARD (FILLED CARD CONTAINER) */}
          <ScrollReveal delay={150} className="lg:col-span-5">
            <div className="rounded-3xl p-6 sm:p-8 bg-slate-50 border-2 border-yellow-400 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-black text-gray-950">
                  Instant Jobsite Delivery Validator
                </h3>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-medium">
                Enter your project location or jobsite zip code to verify immediate dispatch availability and our $150 delivery rate:
              </p>

              <form onSubmit={handleCheckZip} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                    Arizona Jobsite Zip Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={5}
                      value={zipInput}
                      onChange={(e) => setZipInput(e.target.value)}
                      placeholder="e.g. 85331, 85255, 85022"
                      className="flex-1 bg-gray-50/60 hover:bg-white focus:bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-500/10 font-bold transition-all"
                    />
                    <button
                      type="submit"
                      className="btn-yellow px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm"
                    >
                      Check Zone
                    </button>
                  </div>
                </div>

                {zipStatus && (
                  <div
                    className={`p-4 rounded-xl text-xs font-bold flex items-start gap-2.5 border-2 ${
                      zipStatus.covered
                        ? "bg-yellow-50 border-yellow-400 text-yellow-950"
                        : "bg-red-50 border-red-400 text-red-950"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                    <span>{zipStatus.message}</span>
                  </div>
                )}
              </form>

              <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Need immediate dispatch?</span>
                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="text-red-600 font-black hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {COMPANY_INFO.phone}</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
