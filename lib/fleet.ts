export interface EquipmentItem {
  id: string;
  name: string;
  slug: string;
  category: "Track Loader" | "Utility Tractor" | "Water Trailer" | "Heavy Trailer" | "Skid Steer";
  tagline: string;
  description: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  includedHours: string;
  overtimeRate: number;
  engineSpecs: string;
  operatingWeight: string;
  keyFeatures: string[];
  requiresAZ811: boolean;
  availableAttachments?: {
    name: string;
    dailyPrice: number;
    weeklyPrice: number;
  }[];
  imageUrl: string;
  badge?: string;
}

export const COMPANY_INFO = {
  name: "AZ Rental Guy",
  legalName: "J-Bone Industries LLC",
  phone: "(707) 326-5592",
  phoneRaw: "7073265592",
  email: "jbone@azrentalguy.com",
  serviceArea: "Valley-Wide (Phoenix, Cave Creek, Scottsdale, Mesa, Chandler, Glendale, Peoria, Gilbert, Surprise, Buckeye)",
  flatDeliveryFee: 150,
  taxRate: 0.086, // 8.6% Maricopa County
  securityDepositHold: 500,
  damageWaiverRate: 0.10, // 10%
  overtimeHourlyRate: 75,
};

export const FLEET: EquipmentItem[] = [
  {
    id: "cat-259d3",
    slug: "cat-259d3-compact-track-loader",
    name: "CAT 259D3 Compact Track Loader",
    category: "Track Loader",
    tagline: "Powerful, versatile, and engineered for Arizona's toughest terrain.",
    description:
      "Purpose-built for desert excavation, site grading, landscaping, and heavy material handling. Features superior traction, low ground pressure rubber tracks, and exceptional breakout force.",
    dailyRate: 450,
    weeklyRate: 1300,
    monthlyRate: 3150,
    includedHours: "8 hrs/day • 40 hrs/wk • 160 hrs/mo",
    overtimeRate: 75,
    engineSpecs: "CAT C3.3B DIT Turbo Diesel (74.3 hp / 55.4 kW)",
    operatingWeight: "8,987 lbs (4,076 kg)",
    keyFeatures: [
      "Sealed & pressurized cab with high-flow auxiliary hydraulics",
      "Low ground disturbance rubber tracks for Arizona dirt and hardpack",
      "Included 8h/day, 40h/week operating allowance",
      "Mandatory Arizona 811 Call-Before-You-Dig safety compliance",
    ],
    requiresAZ811: true,
    badge: "Most Popular",
    imageUrl: "/images/cat-259d3.jpg",
  },
  {
    id: "cat-226d3",
    slug: "2021-cat-226d3-skid-steer-loader",
    name: "2021 Cat 226D3 CA Skid Steer Loader",
    category: "Skid Steer",
    tagline: "Enclosed cab model with AC & stereo. Compact radial-lift skid steer.",
    description:
      "Compact radial-lift skid steer built for tight spaces and everyday work. Popular for landscaping, grading, material handling, light excavation, and residential or small commercial projects. Features an enclosed pressurized cab with air conditioning and stereo.",
    dailyRate: 275,
    weeklyRate: 1000,
    monthlyRate: 1650,
    includedHours: "8 hrs/day • 40 hrs/wk • 160 hrs/mo",
    overtimeRate: 75,
    engineSpecs: "Cat C2.2 Diesel (67 hp)",
    operatingWeight: "5,850 lb (1,550 lb ROC / 1,650 lb w/ counterweight)",
    keyFeatures: [
      "Enclosed cab model with air conditioning and stereo",
      "Radial lift geometry with 1,550 lb rated operating capacity",
      "Compact footprint for tight residential gates and everyday site work",
      "Ideal for dirt, mulch, gravel, loading trucks, and property maintenance",
    ],
    requiresAZ811: true,
    badge: "New Arrival",
    imageUrl: "/images/equipments/2021 Cat 226D3/1.jpg",
  },
  {
    id: "jd-4044m",
    slug: "2021-john-deere-4044m-tractor",
    name: "2021 John Deere 4044M Utility Tractor",
    category: "Utility Tractor",
    tagline: "Dependable 44-HP 4WD tractor with heavy front-end loader bucket.",
    description:
      "Ideal for property maintenance, grading, soil prep, and hauling. Complete with 4-wheel drive and hydrostatic transmission for effortless maneuvering.",
    dailyRate: 300,
    weeklyRate: 1000,
    monthlyRate: 1700,
    includedHours: "8 hrs/day • 40 hrs/wk • 160 hrs/mo",
    overtimeRate: 75,
    engineSpecs: "44 HP Yanmar 4-Cylinder Liquid-Cooled Diesel",
    operatingWeight: "Approx. 4,200 lbs with loader",
    keyFeatures: [
      "Front-End Heavy Loader Bucket included standard",
      "Hydrostatic 4WD drivetrain with differential lock",
      "Optional Pallet Forks and Gannon Box Scraper attachments",
      "Low hourly usage, fully serviced before every rental",
    ],
    requiresAZ811: false,
    availableAttachments: [
      {
        name: "Heavy-Duty Pallet Forks",
        dailyPrice: 50,
        weeklyPrice: 100,
      },
      {
        name: "Gannon Box Scraper Attachment",
        dailyPrice: 50,
        weeklyPrice: 100,
      },
    ],
    badge: "Versatile",
    imageUrl: "/images/jd-4044m.jpg",
  },
  {
    id: "wt5c",
    slug: "multi-quip-wt5c-water-trailer",
    name: "Multi-Quip WT5C 500-Gal Water Trailer",
    category: "Water Trailer",
    tagline: "Commercial dust control, soil compaction, and site water supply.",
    description:
      "DOT-compliant mobile water trailer engineered for construction dust suppression, grading compaction, and fire prevention on Arizona desert jobsites.",
    dailyRate: 150,
    weeklyRate: 450,
    monthlyRate: 1000,
    includedHours: "Unlimited Operating Hours",
    overtimeRate: 0,
    engineSpecs: "Honda Engine Centrifugal Water Pump System",
    operatingWeight: "500 Gallon Capacity (DOT Highway Rated)",
    keyFeatures: [
      "Rear & front high-volume spray bars with cab-activated controls",
      "High-pressure quick-connect fire hose nozzle included",
      "Dual axles with electric safety brakes and DOT-approved lighting",
      "Quick-fill anti-siphon pipe for hydrants and fill tanks",
    ],
    requiresAZ811: false,
    badge: "Dust Control",
    imageUrl: "/images/wt5c.jpg",
  },
  {
    id: "load-trail",
    slug: "2025-load-trail-gooseneck-trailer",
    name: "2025 Load Trail Gooseneck Deckover Trailer",
    category: "Heavy Trailer",
    tagline: "Commercial heavy hauler with monster fold-down equipment ramps.",
    description:
      "Heavy-duty deckover gooseneck trailer built to transport track loaders, tractors, and commercial building materials with dual 10,000 lb axles and heavy D-ring tie-downs.",
    dailyRate: 175,
    weeklyRate: 700,
    monthlyRate: 2300,
    includedHours: "Unlimited Miles & Hours (Valley-Wide)",
    overtimeRate: 0,
    engineSpecs: "Commercial Gooseneck Coupler (2-5/16\" Ball)",
    operatingWeight: "20,000 lbs GVWR (Dual 10K Dexter Axles)",
    keyFeatures: [
      "Spring-assisted Monster Flip-Over Equipment Ramps",
      "Full perimeter stake pockets & heavy welded D-ring tie downs",
      "Treated wood deck engineered for steel and rubber tracks",
      "All-wheel electric drum brakes and break-away battery kit",
    ],
    requiresAZ811: false,
    badge: "Heavy Hauler",
    imageUrl: "/images/load-trail.jpg",
  },
];

