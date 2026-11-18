import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeFleetShowcase from "@/components/HomeFleetShowcase";
import PricingSection from "@/components/PricingSection";
import BookingSection from "@/components/BookingSection";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AZ Rental Guy | Heavy Equipment Rental Phoenix & Maricopa County",
  description:
    "Professional equipment rental in Phoenix, Scottsdale, and Cave Creek. CAT compact track loaders, John Deere tractors, water trailers & deckover trailers with $150 flat Valley delivery.",
};

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <Hero />
        <HomeFleetShowcase />
        <PricingSection />
        <BookingSection />
        <ServiceAreaMap />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
