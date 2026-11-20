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
  images?: string[];
  badge?: string;
  fullSpecs?: { label: string; value: string }[];
  status?: "available" | "rented" | "maintenance" | "reserved";
  serialNumber?: string;
  engineHours?: number;
  nextServiceHours?: number;
  year?: number;
  weekendRate?: number;
  depositAmount?: number;
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
    tagline: "Powerful, versatile, and ready for your toughest jobs.",
    description:
      "Perfect for landscaping, grading, and construction projects. Sealed cab with high-flow auxiliary hydraulics and rubber tracks.",
    dailyRate: 450,
    weeklyRate: 1300,
    monthlyRate: 3150,
    includedHours: "8 hrs/day • 40 hrs/wk • 160 hrs/mo",
    overtimeRate: 75,
    engineSpecs: "CAT C3.3B DIT Turbo Diesel (74.3 hp / 55.4 kW)",
    operatingWeight: "8,987 lb (4,076 kg) • 2,010 lb ROC",
    keyFeatures: [
      "Lift Capacity: 2,010 lb (915 kg) • Lift Height: 121 in (3,075 mm)",
      "Low ground disturbance rubber tracks for dirt and hardpack",
      "Includes 8h/day, 40h/week operating allowance ($75/hr overtime)",
      "Available Pallet Forks attachment (+$50/day or +$100/week)",
    ],
    requiresAZ811: true,
    fullSpecs: [
      { label: "Engine Model", value: "CAT C3.3B DIT Turbo Diesel" },
      { label: "Gross Power", value: "74.3 hp (55.4 kW) @ 2,400 RPM" },
      { label: "Operating Weight", value: "8,987 lb (4,076 kg)" },
      { label: "Rated Operating Capacity (50%)", value: "2,010 lb (915 kg) / 2,900 lb w/ counterweight" },
      { label: "Tipping Load", value: "5,800 lb (2,631 kg)" },
      { label: "Max Pin Lift Height", value: "121 in (3,075 mm)" },
      { label: "Track Type & Ground Pressure", value: "Low-Disturbance Rubber Tracks (4.9 psi)" },
      { label: "Auxiliary Hydraulics", value: "High-Flow Quick-Connect Auxiliary Hydraulics" },
      { label: "Cab Type", value: "Enclosed, Pressurized Cab with AC & Heat" },
      { label: "Fuel Tank Capacity", value: "27.7 Gallons (Ultra-Low Sulfur Diesel)" },
      { label: "Included Operating Allowance", value: "8 hrs/day • 40 hrs/wk • 160 hrs/mo" },
      { label: "Overtime Hourly Rate", value: "$75.00 / engine meter hour" },
      { label: "Legal / Safety Compliance", value: "Mandatory Arizona 811 Dig-Law (A.R.S. § 40-360.21)" },
    ],
    availableAttachments: [
      {
        name: "Pallet Forks Attachment",
        dailyPrice: 50,
        weeklyPrice: 100,
      },
    ],
    imageUrl: "/images/cat-ontrailer.webp",
    images: [
      "/images/cat-ontrailer.webp",
      "/images/cat-front.webp",
      "/images/cat-side.webp",
      "/images/cat-back.webp",
    ],
  },
  {
    id: "cat-226d3",
    slug: "2021-cat-226d3-skid-steer-loader",
    name: "2021 Cat 226D3 Skid Steer Loader",
    category: "Skid Steer",
    tagline: "Enclosed cab model with AC & stereo.",
    description:
      "Compact radial-lift skid steer built for tight residential gates, dirt, gravel, and property maintenance.",
    dailyRate: 275,
    weeklyRate: 1000,
    monthlyRate: 1650,
    includedHours: "8 hrs/day • 40 hrs/wk • 160 hrs/mo",
    overtimeRate: 75,
    engineSpecs: "Cat C2.2 Diesel (67 hp)",
    operatingWeight: "5,850 lb (1,550 lb ROC / 1,650 lb w/ counterweight)",
    keyFeatures: [
      "Enclosed pressurized cab with air conditioning and stereo",
      "Radial lift geometry with 1,550 lb rated operating capacity",
      "Compact footprint for tight residential gates and site work",
      "Heavy-duty material dirt bucket included standard",
    ],
    requiresAZ811: true,
    fullSpecs: [
      { label: "Engine Model", value: "Cat C2.2 CRDI Diesel" },
      { label: "Gross Power", value: "67.1 hp (50.0 kW)" },
      { label: "Operating Weight", value: "5,850 lb (2,653 kg)" },
      { label: "Rated Operating Capacity (50%)", value: "1,550 lb (1,650 lb w/ counterweight)" },
      { label: "Lift Geometry", value: "Radial Lift Design" },
      { label: "Overall Width", value: "60 in (Compact residential gate pass-through)" },
      { label: "Cab Type", value: "Enclosed Pressurized Cab with AC & Stereo" },
      { label: "Standard Attachment", value: "Heavy-Duty Material / Dirt Bucket" },
      { label: "Fuel Tank Capacity", value: "15.1 Gallons (Diesel)" },
      { label: "Included Operating Allowance", value: "8 hrs/day • 40 hrs/wk • 160 hrs/mo" },
      { label: "Overtime Hourly Rate", value: "$75.00 / engine meter hour" },
      { label: "Legal / Safety Compliance", value: "Mandatory Arizona 811 Dig-Law (A.R.S. § 40-360.21)" },
    ],
    imageUrl: "/images/equipments/2021 Cat 226D3/1.jpg",
    images: [
      "/images/equipments/2021 Cat 226D3/1.jpg",
      "/images/equipments/2021 Cat 226D3/2.jpg",
      "/images/equipments/2021 Cat 226D3/3.jpg",
      "/images/equipments/2021 Cat 226D3/4.jpg",
      "/images/equipments/2021 Cat 226D3/5.jpg",
    ],
  },
  {
    id: "jd-4044m",
    slug: "2021-john-deere-4044m-tractor",
    name: "2021 John Deere 4044M",
    category: "Utility Tractor",
    tagline: "With loader bucket and grapple attachments.",
    description:
      "44 hp, 3-cylinder Yanmar diesel with 4WD, hydrostatic transmission, and quick-attach bucket. Perfect for landscaping or farm work.",
    dailyRate: 300,
    weeklyRate: 1000,
    monthlyRate: 1700,
    includedHours: "8 hrs/day • 40 hrs/wk • 160 hrs/mo",
    overtimeRate: 75,
    engineSpecs: "44 hp Yanmar 3-Cylinder Diesel (101.3 CID)",
    operatingWeight: "~2,800 lbs with loader (1,400 lb lift capacity)",
    keyFeatures: [
      "44M front loader with 1,400 lb lift capacity, 6.9 ft max height",
      "Hydrostatic 4WD drivetrain with foldable ROPS and 12.3 gal tank",
      "Quick-attach bucket (1.43 cu yd) and grapple for material handling",
      "Available Gannon Attachment (+$50/day or +$100/week)",
    ],
    requiresAZ811: false,
    fullSpecs: [
      { label: "Engine Model", value: "44 hp Yanmar 3-Cylinder Diesel (101.3 CID)" },
      { label: "PTO Power", value: "32.7 hp @ 2,600 RPM" },
      { label: "Operating Weight", value: "~2,800 lbs Base (~3,700 lbs with 44M Loader)" },
      { label: "Front Loader Capacity", value: "44M Loader with 1,400 lb Lift Capacity (6.9 ft max height)" },
      { label: "Drivetrain & Steering", value: "Hydrostatic 4WD with Differential Lock & Power Steering" },
      { label: "Operator Station", value: "Open Station with Foldable ROPS Safety Frame" },
      { label: "Included Attachments", value: "Quick-Attach Loader Bucket (1.43 cu yd) & Grapple" },
      { label: "Optional Attachment", value: "Gannon Box Scraper Attachment (+$50/d, +$100/w)" },
      { label: "Fuel Tank Capacity", value: "12.3 Gallons (Diesel)" },
      { label: "Included Operating Allowance", value: "8 hrs/day • 40 hrs/wk • 160 hrs/mo" },
      { label: "Overtime Hourly Rate", value: "$75.00 / engine meter hour" },
    ],
    availableAttachments: [
      {
        name: "Gannon Box Scraper Attachment",
        dailyPrice: 50,
        weeklyPrice: 100,
      },
    ],
    imageUrl: "/images/jd-4044.webp",
    images: ["/images/jd-4044.webp"],
  },
  {
    id: "wt5c",
    slug: "multi-quip-wt5c-water-trailer",
    name: "Multi-quip WT5C 500-gallon water trailer",
    category: "Water Trailer",
    tagline: "Dust control, compaction, general water hauling.",
    description:
      "500-gallon polyethylene tank with 2-inch QP2H centrifugal pump (158 GPM flow) and dual-axle highway towable trailer.",
    dailyRate: 150,
    weeklyRate: 450,
    monthlyRate: 1000,
    includedHours: "Unlimited Operating Hours",
    overtimeRate: 0,
    engineSpecs: "Honda Engine Centrifugal Pump (158 GPM Flow)",
    operatingWeight: "500 Gallon Capacity (~2,500 lbs empty)",
    keyFeatures: [
      "Rear spray bar, front nozzle, and hand washdown hose",
      "12-inch vented fill port (fills in 5 minutes at max)",
      "Dual axles with electric brakes and DOT road lighting",
      "Four highway road tires, fully highway towable",
    ],
    requiresAZ811: false,
    fullSpecs: [
      { label: "Tank Capacity", value: "500 Gallons (525-Gallon Polyethylene Storage Tank)" },
      { label: "Water Pump Model", value: "2-Inch Multiquip QP2H Centrifugal Pump" },
      { label: "Engine", value: "Honda Industrial Gasoline Engine" },
      { label: "Discharge Flow Rate", value: "158 GPM (Gallons Per Minute)" },
      { label: "Fill Port", value: "12-Inch Vented Top Fill Port (Full in ~5 min)" },
      { label: "Spray Configurations", value: "Rear Spray Bar, Front Flusher & 25 ft Washdown Hose" },
      { label: "Trailer Axles & Brakes", value: "Tandem DOT Dual Axles with Electric Brakes" },
      { label: "Weight", value: "~2,500 lbs Empty / ~6,700 lbs Full of Water" },
      { label: "Hitch Coupler", value: "2-5/16 in Ball Coupler & DOT Safety Chains" },
      { label: "Operating Allowance", value: "Unlimited Operating Hours ($0 Overtime)" },
      { label: "Primary Use Cases", value: "Dust Control, Soil Compaction, General Water Hauling" },
    ],
    imageUrl: "/images/water-trailer.webp",
    images: ["/images/water-trailer.webp"],
  },
  {
    id: "load-trail",
    slug: "2025-load-trail-gooseneck-trailer",
    name: "2025 Load Trail Gooseneck Deckover Trailer",
    category: "Heavy Trailer",
    tagline: "26 ft overall length with hydraulic tilt deck.",
    description:
      "Heavy-duty deckover tilt trailer with tandem 10K axles, 22 ft tilt section + 4 ft fixed deck, and 2-5/16\" gooseneck ball coupler.",
    dailyRate: 175,
    weeklyRate: 700,
    monthlyRate: 2300,
    includedHours: "Unlimited Miles & Hours (Valley-Wide)",
    overtimeRate: 0,
    engineSpecs: "Gooseneck Coupler (2-5/16\" Ball, 30K Rated)",
    operatingWeight: "20,000 lbs GVWR (Tandem 10K Axles)",
    keyFeatures: [
      "Hydraulic single-cylinder tilt with wireless remote & in-cab controls",
      "16 heavy welded D-rings (4,400 lb rating each; 8 on sides, 8 on deck)",
      "12 in I-beam frame with 3 in channel crossmembers on 12 in centers",
      "Electric drum brakes on all axles with breakaway battery kit",
    ],
    requiresAZ811: false,
    fullSpecs: [
      { label: "Deck Dimensions", value: "26 ft Overall (22 ft Hydraulic Tilt Deck + 4 ft Fixed Front Deck)" },
      { label: "GVWR", value: "20,000 lbs Gross Vehicle Weight Rating" },
      { label: "Axles & Suspension", value: "Tandem 10,000 lb Dexter Commercial Axles (Torsion Suspension)" },
      { label: "Tilt Mechanism", value: "Hydraulic Single-Cylinder Tilt with Wireless Remote & In-Cab Switch" },
      { label: "Frame & Crossmembers", value: "12 in I-Beam Frame with 3 in Channel Crossmembers on 12 in Centers" },
      { label: "Hitch Coupler", value: "2-5/16 in Adjustable Gooseneck Ball Coupler (30K Rated)" },
      { label: "Tie-Down Points", value: "16 Welded Heavy D-Rings (4,400 lb Rating; 8 on Sides, 8 on Deck)" },
      { label: "Brakes & Breakaway", value: "Electric Drum Brakes on All Wheels with Emergency Breakaway Battery" },
      { label: "Tires & Wheels", value: "ST235/80R16 Load Range G 14-Ply Radial Tires" },
      { label: "Tow Vehicle Requirements", value: "Class 4/5 Truck with 20K+ Tow Rating & Electric Brake Controller" },
      { label: "Operating Allowance", value: "Unlimited Miles & Hours (Valley-Wide)" },
    ],
    imageUrl: "/images/cat-ontrailer.webp",
    images: ["/images/cat-ontrailer.webp"],
  },
];

export function getStoredFleet(): EquipmentItem[] {
  if (typeof window === "undefined") return FLEET;
  try {
    const stored = localStorage.getItem("az_admin_fleet");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load stored fleet:", err);
  }
  return FLEET;
}

export function saveStoredFleet(fleet: EquipmentItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("az_admin_fleet", JSON.stringify(fleet));
    window.dispatchEvent(new Event("az_fleet_updated"));
    // Asynchronously sync to database on Plesk
    fetch("/api/fleet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fleet),
    }).catch(() => {});
  } catch (err) {
    console.error("Failed to save stored fleet:", err);
  }
}
