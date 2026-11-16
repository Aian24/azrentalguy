import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeFleetShowcase from "@/components/HomeFleetShowcase";
import HomeOverview from "@/components/HomeOverview";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <Hero />
        <HomeFleetShowcase />
        <HomeOverview />
        <ServiceAreaMap />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
