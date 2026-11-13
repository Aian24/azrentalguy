import React from "react";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import BookingSection from "@/components/BookingSection";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Book Equipment | 48-Hour Reservation Hold | AZ Rental Guy",
  description:
    "Request an equipment rental online. Free 48-hour reservation hold, instant pricing calculator, and mobile Arizona 811 digital agreement.",
};

export default function BookNowPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <PageHero
          title="Request an Equipment"
          highlightText="48-Hour Hold"
          subtitle="Reserve your machine dates with zero upfront full-fee charge. Our pricing engine automatically calculates the cheapest rates and applies our $150 flat Valley delivery."
          primaryCtaText="Explore Machine Fleet"
          primaryCtaHref="/equipment"
          secondaryCtaText="View All Pricing"
          secondaryCtaHref="/pricing"
        />
        <BookingSection />
        <ServiceAreaMap />
      </main>
      <Footer />
    </div>
  );
}
