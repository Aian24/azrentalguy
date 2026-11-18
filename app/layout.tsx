import type { Metadata } from "next";
import "./globals.css";
import { COMPANY_INFO } from "@/lib/fleet";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "AZ Rental Guy | Professional Equipment Rental Phoenix AZ | J-Bone Industries",
  description:
    "Valley-wide equipment rental in Arizona. CAT 259D3 compact track loaders, John Deere 4WD utility tractors, 500-gallon water trailers, and heavy equipment trailers with $150 flat jobsite delivery.",
  keywords: [
    "AZ Rental Guy",
    "J-Bone Industries",
    "equipment rental Phoenix",
    "CAT 259D3 rental Arizona",
    "compact track loader rental Cave Creek",
    "tractor rental Scottsdale",
    "water trailer rental Maricopa County",
    "equipment trailer rental",
    "skid steer rental Phoenix",
  ],
  authors: [{ name: "J-Bone Industries LLC" }],
  openGraph: {
    title: "AZ Rental Guy | Professional Equipment Rental Valley-Wide",
    description:
      "Modern heavy machinery & trailer rentals delivered to your jobsite in Arizona. Instant quotes, 48-hr free holds, and mobile agreements.",
    url: "https://azrentalguy.com",
    siteName: "AZ Rental Guy",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD LOCAL BUSINESS STRUCTURED DATA FOR ARIZONA SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoEquipmentRentalStore",
    name: COMPANY_INFO.name,
    legalName: COMPANY_INFO.legalName,
    telephone: COMPANY_INFO.phone,
    email: COMPANY_INFO.email,
    url: "https://azrentalguy.com",
    areaServed: [
      "Phoenix, AZ",
      "Cave Creek, AZ",
      "Scottsdale, AZ",
      "Mesa, AZ",
      "Chandler, AZ",
      "Glendale, AZ",
      "Peoria, AZ",
      "Gilbert, AZ",
      "Surprise, AZ",
      "Buckeye, AZ",
    ],
    priceRange: "$150 - $3,150",
    description:
      "Professional heavy machinery and commercial trailer rentals valley-wide in Maricopa County, Arizona.",
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}

