import React from "react";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import EquipmentCatalog from "@/components/EquipmentCatalog";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Equipment Fleet | AZ Rental Guy | J-Bone Industries",
  description:
    "Explore our commercial equipment fleet in Arizona. CAT 259D3 track loaders, John Deere 4044M utility tractors, 500-gallon water trailers, and commercial trailers.",
};

export default function EquipmentPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <PageHero
          title="Heavy Machinery &"
          highlightText="Utility Trailers"
          subtitle="Explore low-hour compact track loaders, 4WD utility tractors, 500-gallon water trailers, and commercial haulers delivered direct to your Arizona jobsite."
          primaryCtaText="Book Equipment Online"
          primaryCtaHref="/book-now"
          secondaryCtaText="View All Pricing"
          secondaryCtaHref="/pricing"
        />
        <EquipmentCatalog />
      </main>
      <Footer />
    </div>
  );
}
