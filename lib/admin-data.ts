import { FLEET, COMPANY_INFO } from "./fleet";

export interface DispatchItem {
  id: string;
  customerName: string;
  companyName?: string;
  phone: string;
  email: string;
  equipmentId: string;
  equipmentName: string;
  jobsiteAddress: string;
  zipCode: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string;
  returnDate: string;
  type: "delivery" | "return" | "hold";
  status: "scheduled" | "dispatched" | "on-site" | "completed" | "delayed";
  driver: string;
  notes?: string;
  amount: number;
}

export interface ActiveHold {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  equipmentId: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalAmount: number;
  expiresAt: string; // ISO string
  hoursRemaining: number;
  signatureStatus: "signed" | "pending";
  agreementId: string;
  jobsiteZip: string;
}

export interface PipelineLead {
  id: string;
  customerName: string;
  companyName?: string;
  phone: string;
  email: string;
  equipmentId: string;
  equipmentName: string;
  stage: "inquired" | "quoted" | "agreement_sent" | "reserved" | "active" | "closed";
  startDate: string;
  endDate: string;
  jobsiteAddress: string;
  quotedAmount: number;
  createdAt: string;
  notes?: string;
  priority: "high" | "normal" | "urgent";
}

export interface CalendarBooking {
  id: string;
  equipmentId: string;
  customerName: string;
  companyName?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: "active" | "reserved" | "hold" | "maintenance";
  notes?: string;
}

export interface PermitLead {
  id: string;
  permitNumber: string;
  issuedDate: string;
  contractorName: string;
  phone: string;
  email: string;
  jobsiteAddress: string;
  city: string;
  projectType: string;
  valuation: string;
  recommendedEquipment: string;
  matchScore: number;
  aiPitchDraft: string;
  status: "new" | "contacted" | "quoted" | "declined";
}

export interface ReviewFollowUp {
  id: string;
  customerName: string;
  phone: string;
  equipmentName: string;
  returnDate: string;
  queueStatus: "queued" | "sent" | "clicked" | "reviewed";
  sentAt?: string;
  ratingGiven?: number;
  reviewLink: string;
}

// SAMPLE DATA SEED
export const INITIAL_DISPATCH: DispatchItem[] = [
  {
    id: "DSP-101",
    customerName: "Mike Callahan",
    companyName: "Callahan Earthworks LLC",
    phone: "(602) 555-0192",
    email: "mike@callahanearth.com",
    equipmentId: "cat-259d3",
    equipmentName: "CAT 259D3 Compact Track Loader",
    jobsiteAddress: "34820 N Cave Creek Rd, Cave Creek, AZ 85331",
    zipCode: "85331",
    scheduledDate: "2026-11-19",
    scheduledTime: "07:00 AM - 08:30 AM",
    returnDate: "2026-11-26",
    type: "delivery",
    status: "dispatched",
    driver: "J-Bone Rig #1 (F-350 + Gooseneck)",
    notes: "Gate code #4412. Unload on gravel driveway next to garage.",
    amount: 1450,
  },
  {
    id: "DSP-102",
    customerName: "Travis Vance",
    companyName: "Desert Horizon Landscaping",
    phone: "(480) 555-7821",
    email: "travis@deserthorizonaz.com",
    equipmentId: "john-deere-4044m",
    equipmentName: "2021 John Deere 4044M + Gannon",
    jobsiteAddress: "9210 E Pinnacle Peak Rd, Scottsdale, AZ 85255",
    zipCode: "85255",
    scheduledDate: "2026-11-19",
    scheduledTime: "09:30 AM - 10:30 AM",
    returnDate: "2026-11-23",
    type: "delivery",
    status: "scheduled",
    driver: "J-Bone Rig #2 (Tilt Deck)",
    notes: "Customer on site with check/card for damage waiver.",
    amount: 1150,
  },
  {
    id: "DSP-103",
    customerName: "Carlos Ramirez",
    companyName: "Sonoran Grading & Paving",
    phone: "(623) 555-3419",
    email: "carlos@sonorangrading.com",
    equipmentId: "wt5c-water-trailer",
    equipmentName: "Multi-quip WT5C 500-Gal Water Trailer",
    jobsiteAddress: "14201 W Bell Rd, Surprise, AZ 85374",
    zipCode: "85374",
    scheduledDate: "2026-11-18",
    scheduledTime: "04:00 PM - 05:30 PM",
    returnDate: "2026-11-19",
    type: "return",
    status: "completed",
    driver: "J-Bone Yard Return",
    notes: "Customer returned clean water hauling trailer to Cave Creek yard.",
    amount: 450,
  },
  {
    id: "DSP-104",
    customerName: "Dave Henderson",
    companyName: "Henderson Pool Excavation",
    phone: "(602) 555-8832",
    email: "dave.henderson@gmail.com",
    equipmentId: "cat-226d3",
    equipmentName: "2021 Cat 226D3 Skid Steer",
    jobsiteAddress: "42100 N Gavilan Peak Pkwy, Anthem, AZ 85086",
    zipCode: "85086",
    scheduledDate: "2026-11-19",
    scheduledTime: "06:30 AM - 07:30 AM",
    returnDate: "2026-11-24",
    type: "delivery",
    status: "on-site",
    driver: "J-Bone Rig #1 (F-350 + Gooseneck)",
    notes: "Tight side gate access; residential backyard pool dig.",
    amount: 975,
  },
  {
    id: "DSP-105",
    customerName: "Rick Martinez",
    companyName: "Valley Trench & Utility",
    phone: "(602) 555-6621",
    email: "rick@valleytrench.com",
    equipmentId: "trailer-gooseneck",
    equipmentName: "2025 Load Trail Gooseneck Trailer",
    jobsiteAddress: "8800 W Peoria Ave, Peoria, AZ 85345",
    zipCode: "85345",
    scheduledDate: "2026-11-20",
    scheduledTime: "11:00 AM - 12:00 PM",
    returnDate: "2026-11-27",
    type: "delivery",
    status: "scheduled",
    driver: "J-Bone Rig #2 (Tilt Deck)",
    notes: "Requires 2-5/16 ball hitch inspection on delivery.",
    amount: 875,
  },
  {
    id: "DSP-106",
    customerName: "Scott Morrison",
    companyName: "Morrison Custom Equine",
    phone: "(480) 555-4390",
    email: "scott@morrisonequine.com",
    equipmentId: "john-deere-4044m",
    equipmentName: "2021 John Deere 4044M + Gannon",
    jobsiteAddress: "28400 N 56th St, Cave Creek, AZ 85331",
    zipCode: "85331",
    scheduledDate: "2026-11-20",
    scheduledTime: "01:30 PM - 02:30 PM",
    returnDate: "2026-11-28",
    type: "delivery",
    status: "scheduled",
    driver: "J-Bone Rig #1 (F-350 + Gooseneck)",
    notes: "Arena drag demo requested upon dropoff.",
    amount: 1250,
  },
  {
    id: "DSP-107",
    customerName: "Bill Harrington",
    companyName: "Harrington Concrete",
    phone: "(623) 555-9011",
    email: "bill@harringtonaz.com",
    equipmentId: "cat-259d3",
    equipmentName: "CAT 259D3 Compact Track Loader",
    jobsiteAddress: "19200 N 83rd Ave, Glendale, AZ 85308",
    zipCode: "85308",
    scheduledDate: "2026-11-17",
    scheduledTime: "08:00 AM - 09:00 AM",
    returnDate: "2026-11-22",
    type: "delivery",
    status: "completed",
    driver: "J-Bone Rig #2 (Tilt Deck)",
    notes: "Completed slab preparation. Paid in full.",
    amount: 1450,
  },
  {
    id: "DSP-108",
    customerName: "Elena Sanchez",
    companyName: "Sonoran Desert Oasis",
    phone: "(480) 555-6677",
    email: "elena@sonoranoasis.com",
    equipmentId: "cat-226d3",
    equipmentName: "2021 Cat 226D3 Skid Steer",
    jobsiteAddress: "7820 E Gray Rd, Scottsdale, AZ 85260",
    zipCode: "85260",
    scheduledDate: "2026-11-21",
    scheduledTime: "03:00 PM - 04:00 PM",
    returnDate: "2026-11-25",
    type: "delivery",
    status: "scheduled",
    driver: "J-Bone Rig #1 (F-350 + Gooseneck)",
    notes: "Include tooth bucket and smooth bucket combo.",
    amount: 1050,
  },
  {
    id: "DSP-109",
    customerName: "Dave Miller",
    companyName: "Miller Grading Services",
    phone: "(602) 555-4411",
    email: "dave@millergradingaz.com",
    equipmentId: "cat-259d3",
    equipmentName: "CAT 259D3 Compact Track Loader",
    jobsiteAddress: "5600 W Olive Ave, Glendale, AZ 85302",
    zipCode: "85302",
    scheduledDate: "2026-11-18",
    scheduledTime: "07:30 AM - 08:30 AM",
    returnDate: "2026-11-19",
    type: "delivery",
    status: "completed",
    driver: "J-Bone Rig #1 (F-350 + Gooseneck)",
    notes: "Job completed yesterday. Machine picked up.",
    amount: 1450,
  },
  {
    id: "DSP-110",
    customerName: "Tom Bradley",
    companyName: "Bradley Horse Stables",
    phone: "(480) 555-8844",
    email: "tom@bradleystables.com",
    equipmentId: "wt5c-water-trailer",
    equipmentName: "Multi-quip WT5C 500-Gal Water Trailer",
    jobsiteAddress: "32000 N Tom Darlington Dr, Carefree, AZ 85377",
    zipCode: "85377",
    scheduledDate: "2026-11-22",
    scheduledTime: "10:00 AM - 11:30 AM",
    returnDate: "2026-11-26",
    type: "delivery",
    status: "scheduled",
    driver: "J-Bone Rig #2 (Tilt Deck)",
    notes: "Water trailer delivery for weekend rodeo event.",
    amount: 600,
  },
];

export const INITIAL_HOLDS: ActiveHold[] = [
  {
    id: "HLD-481",
    customerName: "Dave Henderson",
    phone: "(602) 555-8832",
    email: "dave.henderson@gmail.com",
    equipmentId: "cat-226d3",
    equipmentName: "2021 Cat 226D3 Skid Steer",
    startDate: "2026-11-21",
    endDate: "2026-11-23",
    durationDays: 3,
    totalAmount: 975,
    expiresAt: "2026-11-20T18:30:00.000Z",
    hoursRemaining: 18,
    signatureStatus: "signed",
    agreementId: "AGR-AZ-882194",
    jobsiteZip: "85086 (Anthem)",
  },
  {
    id: "HLD-482",
    customerName: "Brandon Miller",
    phone: "(480) 555-2291",
    email: "bmiller.customhomes@yahoo.com",
    equipmentId: "cat-259d3",
    equipmentName: "CAT 259D3 Compact Track Loader",
    startDate: "2026-11-24",
    endDate: "2026-12-01",
    durationDays: 7,
    totalAmount: 1450,
    expiresAt: "2026-11-20T11:00:00.000Z",
    hoursRemaining: 10,
    signatureStatus: "pending",
    agreementId: "AGR-AZ-882201",
    jobsiteZip: "85262 (North Scottsdale)",
  },
  {
    id: "HLD-483",
    customerName: "Marcus Vance",
    phone: "(602) 555-3310",
    email: "marcus@vancedevelop.com",
    equipmentId: "wt5c-water-trailer",
    equipmentName: "Multi-quip WT5C 500-Gal Water Trailer",
    startDate: "2026-11-23",
    endDate: "2026-11-26",
    durationDays: 4,
    totalAmount: 600,
    expiresAt: "2026-11-21T09:00:00.000Z",
    hoursRemaining: 33,
    signatureStatus: "signed",
    agreementId: "AGR-AZ-882215",
    jobsiteZip: "85331 (Cave Creek)",
  },
  {
    id: "HLD-484",
    customerName: "Tom Gallagher",
    phone: "(480) 555-9088",
    email: "tom@gallagherranch.com",
    equipmentId: "john-deere-4044m",
    equipmentName: "2021 John Deere 4044M + Gannon",
    startDate: "2026-11-25",
    endDate: "2026-11-28",
    durationDays: 4,
    totalAmount: 1000,
    expiresAt: "2026-11-21T14:00:00.000Z",
    hoursRemaining: 38,
    signatureStatus: "pending",
    agreementId: "AGR-AZ-882220",
    jobsiteZip: "85255 (Scottsdale)",
  },
  {
    id: "HLD-485",
    customerName: "Wyatt Earp",
    phone: "(623) 555-7140",
    email: "wyatt@earpexcavation.com",
    equipmentId: "trailer-gooseneck",
    equipmentName: "2025 Load Trail Gooseneck Trailer",
    startDate: "2026-11-26",
    endDate: "2026-11-29",
    durationDays: 4,
    totalAmount: 700,
    expiresAt: "2026-11-22T08:00:00.000Z",
    hoursRemaining: 46,
    signatureStatus: "pending",
    agreementId: "AGR-AZ-882231",
    jobsiteZip: "85383 (Peoria)",
  },
];

export const INITIAL_LEADS: PipelineLead[] = [
  {
    id: "LD-501",
    customerName: "Gary Phillips",
    companyName: "Phillips Masonry",
    phone: "(602) 555-7312",
    email: "gary@phillipsstone.com",
    equipmentId: "cat-259d3",
    equipmentName: "CAT 259D3 Compact Track Loader",
    stage: "inquired",
    startDate: "2026-11-25",
    endDate: "2026-11-28",
    jobsiteAddress: "Mesa, AZ 85207",
    quotedAmount: 1450,
    createdAt: "2026-11-19T08:15:00.000Z",
    notes: "Needs pallet forks for 12 pallets of Santa Fe flagstone.",
    priority: "urgent",
  },
  {
    id: "LD-502",
    customerName: "Shane Larson",
    companyName: "Larson Horse Properties",
    phone: "(480) 555-9014",
    email: "shane@larsonranches.com",
    equipmentId: "john-deere-4044m",
    equipmentName: "2021 John Deere 4044M + Gannon",
    stage: "quoted",
    startDate: "2026-11-27",
    endDate: "2026-12-04",
    jobsiteAddress: "Cave Creek, AZ 85331",
    quotedAmount: 1250,
    createdAt: "2026-11-18T14:20:00.000Z",
    notes: "Arena drag and 3-acre turn-out conditioning.",
    priority: "normal",
  },
  {
    id: "LD-503",
    customerName: "Brandon Miller",
    companyName: "Miller Custom Homes",
    phone: "(480) 555-2291",
    email: "bmiller.customhomes@yahoo.com",
    equipmentId: "cat-259d3",
    equipmentName: "CAT 259D3 Compact Track Loader",
    stage: "agreement_sent",
    startDate: "2026-11-24",
    endDate: "2026-12-01",
    jobsiteAddress: "North Scottsdale, AZ 85262",
    quotedAmount: 1450,
    createdAt: "2026-11-18T10:00:00.000Z",
    notes: "Sent digital contract SMS. 48-hr hold active.",
    priority: "high",
  },
  {
    id: "LD-504",
    customerName: "Dave Henderson",
    companyName: "Henderson Pool Excavation",
    phone: "(602) 555-8832",
    email: "dave.henderson@gmail.com",
    equipmentId: "cat-226d3",
    equipmentName: "2021 Cat 226D3 Skid Steer",
    stage: "reserved",
    startDate: "2026-11-21",
    endDate: "2026-11-23",
    jobsiteAddress: "Anthem, AZ 85086",
    quotedAmount: 975,
    createdAt: "2026-11-17T16:45:00.000Z",
    notes: "Signed mobile agreement. SHA-256 seal confirmed.",
    priority: "normal",
  },
  {
    id: "LD-505",
    customerName: "Mike Callahan",
    companyName: "Callahan Earthworks LLC",
    phone: "(602) 555-0192",
    email: "mike@callahanearth.com",
    equipmentId: "cat-259d3",
    equipmentName: "CAT 259D3 Compact Track Loader",
    stage: "active",
    startDate: "2026-11-19",
    endDate: "2026-11-26",
    jobsiteAddress: "Cave Creek, AZ 85331",
    quotedAmount: 1450,
    createdAt: "2026-11-16T09:00:00.000Z",
    notes: "Machine on site. 8h/day meter allowance.",
    priority: "high",
  },
  {
    id: "LD-506",
    customerName: "Rick Martinez",
    companyName: "Valley Trench & Utility",
    phone: "(602) 555-6621",
    email: "rick@valleytrench.com",
    equipmentId: "trailer-gooseneck",
    equipmentName: "2025 Load Trail Gooseneck Trailer",
    stage: "closed",
    startDate: "2026-11-10",
    endDate: "2026-11-17",
    jobsiteAddress: "Peoria, AZ 85382",
    quotedAmount: 875,
    createdAt: "2026-11-09T11:30:00.000Z",
    notes: "Returned clean. Deposit released. 5-star review received.",
    priority: "normal",
  },
  {
    id: "LD-507",
    customerName: "Scott Morrison",
    companyName: "Morrison Custom Equine",
    phone: "(480) 555-4390",
    email: "scott@morrisonequine.com",
    equipmentId: "john-deere-4044m",
    equipmentName: "2021 John Deere 4044M + Gannon",
    stage: "quoted",
    startDate: "2026-11-28",
    endDate: "2026-12-05",
    jobsiteAddress: "Cave Creek, AZ 85331",
    quotedAmount: 1250,
    createdAt: "2026-11-19T07:45:00.000Z",
    notes: "Horse arena renovation. Requested box blade attachment.",
    priority: "normal",
  },
  {
    id: "LD-508",
    customerName: "Bill Harrington",
    companyName: "Harrington Concrete",
    phone: "(623) 555-9011",
    email: "bill@harringtonaz.com",
    equipmentId: "cat-259d3",
    equipmentName: "CAT 259D3 Compact Track Loader",
    stage: "active",
    startDate: "2026-11-18",
    endDate: "2026-11-25",
    jobsiteAddress: "Glendale, AZ 85308",
    quotedAmount: 1450,
    createdAt: "2026-11-17T11:00:00.000Z",
    notes: "Commercial slab site prep. Scheduled for pickup.",
    priority: "high",
  },
  {
    id: "LD-509",
    customerName: "Elena Sanchez",
    companyName: "Sonoran Desert Oasis",
    phone: "(480) 555-6677",
    email: "elena@sonoranoasis.com",
    equipmentId: "cat-226d3",
    equipmentName: "2021 Cat 226D3 Skid Steer",
    stage: "inquired",
    startDate: "2026-11-26",
    endDate: "2026-11-30",
    jobsiteAddress: "Scottsdale, AZ 85260",
    quotedAmount: 1050,
    createdAt: "2026-11-19T09:10:00.000Z",
    notes: "Narrow access backyard dig. Needs 66-inch bucket.",
    priority: "urgent",
  },
  {
    id: "LD-510",
    customerName: "Wyatt Earp",
    companyName: "Earp Excavation LLC",
    phone: "(623) 555-7140",
    email: "wyatt@earpexcavation.com",
    equipmentId: "trailer-gooseneck",
    equipmentName: "2025 Load Trail Gooseneck Trailer",
    stage: "agreement_sent",
    startDate: "2026-11-26",
    endDate: "2026-11-29",
    jobsiteAddress: "Peoria, AZ 85383",
    quotedAmount: 700,
    createdAt: "2026-11-19T06:30:00.000Z",
    notes: "Digital rental agreement dispatched via SMS.",
    priority: "normal",
  },
];

export const INITIAL_CALENDAR_BOOKINGS: CalendarBooking[] = [
  {
    id: "BK-01",
    equipmentId: "cat-259d3",
    customerName: "Mike Callahan",
    companyName: "Callahan Earthworks",
    startDate: "2026-11-19",
    endDate: "2026-11-26",
    status: "active",
    notes: "Cave Creek Jobsite",
  },
  {
    id: "BK-02",
    equipmentId: "cat-259d3",
    customerName: "Brandon Miller",
    companyName: "Miller Custom Homes",
    startDate: "2026-11-28",
    endDate: "2026-12-05",
    status: "reserved",
    notes: "North Scottsdale",
  },
  {
    id: "BK-03",
    equipmentId: "cat-226d3",
    customerName: "Dave Henderson",
    companyName: "Henderson Pool",
    startDate: "2026-11-21",
    endDate: "2026-11-23",
    status: "reserved",
    notes: "Anthem yard job",
  },
  {
    id: "BK-04",
    equipmentId: "john-deere-4044m",
    customerName: "Travis Vance",
    companyName: "Desert Horizon Landscaping",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
    status: "active",
    notes: "Pinnacle Peak",
  },
  {
    id: "BK-05",
    equipmentId: "wt5c-water-trailer",
    customerName: "Carlos Ramirez",
    companyName: "Sonoran Grading",
    startDate: "2026-11-15",
    endDate: "2026-11-19",
    status: "active",
    notes: "Surprise dust control",
  },
  {
    id: "BK-06",
    equipmentId: "trailer-gooseneck",
    customerName: "J-Bone Internal Fleet",
    companyName: "Maintenance & Brake Inspection",
    startDate: "2026-11-20",
    endDate: "2026-11-21",
    status: "maintenance",
    notes: "Replace trailer brake shoes & repack bearings",
  },
];

export const INITIAL_PERMITS: PermitLead[] = [
  {
    id: "PMT-8412",
    permitNumber: "MC-GRD-2026-08412",
    issuedDate: "2026-11-18",
    contractorName: "Black Mountain Earthworks LLC",
    phone: "(480) 555-1940",
    email: "bids@blackmountainearth.com",
    jobsiteAddress: "38910 N Spur Cross Rd",
    city: "Cave Creek",
    projectType: "Residential 2.5-Acre Rough Grading & Hillside Retention",
    valuation: "$48,000",
    recommendedEquipment: "CAT 259D3 Compact Track Loader + Gannon Tractor",
    matchScore: 98,
    aiPitchDraft: "Hey Black Mountain Earthworks team, saw your grading permit on Spur Cross Rd. We have our CAT 259D3 track loader & John Deere tractor available in Cave Creek with flat $150 Valley delivery. Can hold it for your start date. Call J-Bone at (707) 326-5592 or visit azrentalguy.com",
    status: "new",
  },
  {
    id: "PMT-8413",
    permitNumber: "MC-POL-2026-09124",
    issuedDate: "2026-11-17",
    contractorName: "Oasis Luxury Pools AZ",
    phone: "(602) 555-4481",
    email: "dispatch@oasispoolsscottsdale.com",
    jobsiteAddress: "10412 E Desert Cove Ave",
    city: "Scottsdale",
    projectType: "Custom In-Ground Pool Excavation & Caliche Breaking",
    valuation: "$85,000",
    recommendedEquipment: "2021 Cat 226D3 Skid Steer (Tight Access)",
    matchScore: 94,
    aiPitchDraft: "Hi Oasis Pools, for your Desert Cove pool excavation, our 2021 Cat 226D3 skid steer fits narrow residential gates with full power and $150 flat delivery. Rate is $275/day or $1,000/week. Quick reservation at azrentalguy.com or call (707) 326-5592.",
    status: "new",
  },
  {
    id: "PMT-8414",
    permitNumber: "MC-COM-2026-03719",
    issuedDate: "2026-11-16",
    contractorName: "Sonoran Civil Contractors",
    phone: "(623) 555-6610",
    email: "ops@sonorancivil.com",
    jobsiteAddress: "8800 W Glendale Ave",
    city: "Glendale",
    projectType: "Commercial Lot Dust Control & Soil Compaction",
    valuation: "$120,000",
    recommendedEquipment: "Multi-quip WT5C 500-Gallon Water Trailer",
    matchScore: 92,
    aiPitchDraft: "Sonoran Civil team: Need Maricopa County dust compliance for Glendale Ave? We have our DOT-approved Multi-quip WT5C 500-gallon water trailer ready for immediate dispatch at $150/day or $450/week. Delivered anywhere in the Valley for $150 flat. (707) 326-5592.",
    status: "contacted",
  },
  {
    id: "PMT-8415",
    permitNumber: "MC-RES-2026-10492",
    issuedDate: "2026-11-15",
    contractorName: "Pinnacle Custom Builders",
    phone: "(480) 555-8319",
    email: "pinnacle@buildersaz.com",
    jobsiteAddress: "27200 N Alma School Rd",
    city: "Scottsdale",
    projectType: "Hillside Pad Foundation & Utility Trenching",
    valuation: "$92,000",
    recommendedEquipment: "CAT 259D3 Compact Track Loader",
    matchScore: 95,
    aiPitchDraft: "Pinnacle Builders: Need a rugged track loader for your Alma School pad excavation? We deliver right to North Scottsdale for $150 flat. Call (707) 326-5592.",
    status: "new",
  },
  {
    id: "PMT-8416",
    permitNumber: "MC-GRD-2026-11028",
    issuedDate: "2026-11-14",
    contractorName: "Red Rock Utilities LLC",
    phone: "(602) 555-2244",
    email: "dispatch@redrockaz.com",
    jobsiteAddress: "15400 W Camelback Rd",
    city: "Litchfield Park",
    projectType: "Water Main Trenching & Subgrade Backfill",
    valuation: "$64,000",
    recommendedEquipment: "2021 Cat 226D3 Skid Steer",
    matchScore: 91,
    aiPitchDraft: "Red Rock Utilities: For your Camelback trenching, our Cat 226D3 skid steer is prepped and ready for $150 flat delivery. (707) 326-5592.",
    status: "contacted",
  },
  {
    id: "PMT-8417",
    permitNumber: "MC-POL-2026-11540",
    issuedDate: "2026-11-13",
    contractorName: "Desert Springs Pool & Spa",
    phone: "(480) 555-3902",
    email: "info@desertspringspools.com",
    jobsiteAddress: "4120 E Carefree Hwy",
    city: "Cave Creek",
    projectType: "New Pool & Spa Construction",
    valuation: "$75,000",
    recommendedEquipment: "CAT 259D3 Compact Track Loader",
    matchScore: 97,
    aiPitchDraft: "Desert Springs Pools: We are right in Cave Creek with a CAT 259D3 track loader available this week for your Carefree Hwy pool dig. Flat $150 delivery. (707) 326-5592.",
    status: "new",
  },
  {
    id: "PMT-8418",
    permitNumber: "MC-COM-2026-11899",
    issuedDate: "2026-11-12",
    contractorName: "Canyon West Construction",
    phone: "(623) 555-5811",
    email: "bids@canyonwestaz.com",
    jobsiteAddress: "9900 W Northern Ave",
    city: "Peoria",
    projectType: "Commercial Parking Lot Expansion & Dust Plan",
    valuation: "$140,000",
    recommendedEquipment: "Multi-quip WT5C 500-Gallon Water Trailer",
    matchScore: 89,
    aiPitchDraft: "Canyon West team: Multi-quip 500-gal dust suppression water trailer available for your Northern Ave job. Daily/weekly rates with $150 flat delivery. Call (707) 326-5592.",
    status: "quoted",
  },
];

export const INITIAL_REVIEWS: ReviewFollowUp[] = [
  {
    id: "REV-201",
    customerName: "Rick Martinez (Valley Trench)",
    phone: "(602) 555-6621",
    equipmentName: "2025 Load Trail Gooseneck Trailer",
    returnDate: "2026-11-17",
    queueStatus: "reviewed",
    sentAt: "2026-11-18 10:00 AM",
    ratingGiven: 5,
    reviewLink: "https://g.page/r/azrentalguy/review",
  },
  {
    id: "REV-202",
    customerName: "Carlos Ramirez (Sonoran Grading)",
    phone: "(623) 555-3419",
    equipmentName: "Multi-quip WT5C Water Trailer",
    returnDate: "2026-11-19",
    queueStatus: "queued",
    reviewLink: "https://g.page/r/azrentalguy/review",
  },
  {
    id: "REV-203",
    customerName: "Travis Vance (Desert Horizon)",
    phone: "(480) 555-7821",
    equipmentName: "2021 John Deere 4044M",
    returnDate: "2026-11-15",
    queueStatus: "sent",
    sentAt: "2026-11-16 09:30 AM",
    reviewLink: "https://g.page/r/azrentalguy/review",
  },
  {
    id: "REV-204",
    customerName: "Dave Henderson (Henderson Pool)",
    phone: "(602) 555-8832",
    equipmentName: "2021 Cat 226D3 Skid Steer",
    returnDate: "2026-11-18",
    queueStatus: "reviewed",
    sentAt: "2026-11-19 08:45 AM",
    ratingGiven: 5,
    reviewLink: "https://g.page/r/azrentalguy/review",
  },
  {
    id: "REV-205",
    customerName: "Scott Morrison (Morrison Equine)",
    phone: "(480) 555-4390",
    equipmentName: "2021 John Deere 4044M",
    returnDate: "2026-11-19",
    queueStatus: "queued",
    reviewLink: "https://g.page/r/azrentalguy/review",
  },
  {
    id: "REV-206",
    customerName: "Gary Phillips (Phillips Masonry)",
    phone: "(602) 555-7312",
    equipmentName: "CAT 259D3 Track Loader",
    returnDate: "2026-11-16",
    queueStatus: "sent",
    sentAt: "2026-11-17 11:20 AM",
    reviewLink: "https://g.page/r/azrentalguy/review",
  },
  {
    id: "REV-207",
    customerName: "Bill Harrington (Harrington Concrete)",
    phone: "(623) 555-9011",
    equipmentName: "CAT 259D3 Track Loader",
    returnDate: "2026-11-14",
    queueStatus: "reviewed",
    sentAt: "2026-11-15 02:15 PM",
    ratingGiven: 5,
    reviewLink: "https://g.page/r/azrentalguy/review",
  },
  {
    id: "REV-208",
    customerName: "Elena Sanchez (Sonoran Oasis)",
    phone: "(480) 555-6677",
    equipmentName: "2021 Cat 226D3 Skid Steer",
    returnDate: "2026-11-19",
    queueStatus: "queued",
    reviewLink: "https://g.page/r/azrentalguy/review",
  },
];

export interface SalesTransaction {
  id: string;
  customerName: string;
  companyName?: string;
  equipmentName: string;
  amount: number;
  date: string;
  paymentMethod: "Credit Card" | "ACH / Wire" | "Company Check" | "Pre-Auth Hold";
  status: "Paid" | "Pending" | "Deposit Held";
  jobsite: string;
}

export const INITIAL_SALES_TRANSACTIONS: SalesTransaction[] = [
  {
    id: "TXN-9041",
    customerName: "Mike Callahan",
    companyName: "Callahan Earthworks LLC",
    equipmentName: "CAT 259D3 Compact Track Loader",
    amount: 1450,
    date: "Today, 8:15 AM",
    paymentMethod: "Credit Card",
    status: "Paid",
    jobsite: "Cave Creek, AZ",
  },
  {
    id: "TXN-9040",
    customerName: "Travis Vance",
    companyName: "Desert Horizon Landscaping",
    equipmentName: "2021 John Deere 4044M + Gannon",
    amount: 1150,
    date: "Today, 7:30 AM",
    paymentMethod: "Credit Card",
    status: "Paid",
    jobsite: "Scottsdale, AZ",
  },
  {
    id: "TXN-9039",
    customerName: "Dave Henderson",
    companyName: "Henderson Pool Excavation",
    equipmentName: "2021 Cat 226D3 Skid Steer",
    amount: 975,
    date: "Yesterday",
    paymentMethod: "Pre-Auth Hold",
    status: "Deposit Held",
    jobsite: "Anthem, AZ",
  },
  {
    id: "TXN-9038",
    customerName: "Carlos Ramirez",
    companyName: "Sonoran Grading & Paving",
    equipmentName: "Multi-quip WT5C 500-Gal Water Trailer",
    amount: 450,
    date: "Nov 17",
    paymentMethod: "Credit Card",
    status: "Paid",
    jobsite: "Surprise, AZ",
  },
  {
    id: "TXN-9037",
    customerName: "Rick Martinez",
    companyName: "Valley Trench & Utility",
    equipmentName: "2025 Load Trail Gooseneck Trailer",
    amount: 875,
    date: "Nov 15",
    paymentMethod: "ACH / Wire",
    status: "Paid",
    jobsite: "Peoria, AZ",
  },
  {
    id: "TXN-9036",
    customerName: "Brandon Miller",
    companyName: "Miller Custom Homes",
    equipmentName: "CAT 259D3 Compact Track Loader",
    amount: 3150,
    date: "Nov 14",
    paymentMethod: "Credit Card",
    status: "Deposit Held",
    jobsite: "Scottsdale, AZ",
  },
  {
    id: "TXN-9035",
    customerName: "Gary Phillips",
    companyName: "Phillips Stone & Masonry",
    equipmentName: "2021 Cat 226D3 Skid Steer",
    amount: 1650,
    date: "Nov 12",
    paymentMethod: "Credit Card",
    status: "Paid",
    jobsite: "Mesa, AZ",
  },
  {
    id: "TXN-9034",
    customerName: "Shane Larson",
    companyName: "Larson Horse Properties",
    equipmentName: "2021 John Deere 4044M + Gannon",
    amount: 1000,
    date: "Nov 10",
    paymentMethod: "Credit Card",
    status: "Paid",
    jobsite: "Cave Creek, AZ",
  },
  {
    id: "TXN-9033",
    customerName: "Dan Sullivan",
    companyName: "Sullivan Desert Grading",
    equipmentName: "CAT 259D3 Compact Track Loader",
    amount: 1300,
    date: "Nov 08",
    paymentMethod: "ACH / Wire",
    status: "Paid",
    jobsite: "Glendale, AZ",
  },
  {
    id: "TXN-9032",
    customerName: "Marco Ruiz",
    companyName: "Sonoran Pool & Spa",
    equipmentName: "Multi-quip WT5C 500-Gal Water Trailer",
    amount: 450,
    date: "Nov 05",
    paymentMethod: "Credit Card",
    status: "Paid",
    jobsite: "Scottsdale, AZ",
  },
];

export const SALES_SUMMARY = {
  monthlyTotal: 34850,
  todayTotal: 2600,
  completedRentalsCount: 28,
  averageOrderValue: 1245,
  depositHoldsActive: 2500,
  fleetUtilizationRate: 76,
  equipmentRevenue: [
    { name: "CAT 259D3 Track Loader", amount: 14200, percentage: 41, color: "bg-red-600" },
    { name: "2021 Cat 226D3 Skid Steer", amount: 8400, percentage: 24, color: "bg-yellow-500" },
    { name: "2021 John Deere 4044M", amount: 6500, percentage: 19, color: "bg-red-500" },
    { name: "2025 Load Trail Gooseneck", amount: 3650, percentage: 10, color: "bg-yellow-600" },
    { name: "Multi-quip WT5C Water Trailer", amount: 2100, percentage: 6, color: "bg-gray-400" },
  ],
  weeklySales: [
    { week: "Week 1", amount: 7800 },
    { week: "Week 2", amount: 9200 },
    { week: "Week 3", amount: 8650 },
    { week: "Week 4 (Current)", amount: 9200 },
  ],
};

