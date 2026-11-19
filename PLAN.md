# AZ Rental Guy (J-Bone Industries) - Modern Full-Stack Revamp Plan
**Next.js 15+ & TypeScript Architecture | Vercel Staging to Plesk Production**

---

## 1. Executive Summary & Project Objectives

**Client:** J-Bone Industries LLC (`azrentalguy.com`)  
**Industry:** Heavy Equipment & Commercial Trailer Rentals (Phoenix Valley-Wide, AZ)  
**Primary Contact / Support:** (707) 326-5592 | `jbone@azrentalguy.com`  
**Current State:** Legacy website hosted on Plesk.  
**Core Goal:** Rebuild `azrentalguy.com` into an elite, modern, high-converting lead generation and automated rental management platform. The platform must automate instant quote calculations, real-time booking holds, digital rental agreements with Arizona legal compliance, AI-driven sales lead capture, and back-office equipment dispatch.

### Key Constraints & Requirements:
1. **Modern Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Server Actions & Route Handlers.
2. **Staging on Vercel:** Seamless one-click Vercel Git-connected preview/staging workflow.
3. **Plesk Production Target:** Clean containerized or Node.js Passenger/Reverse-proxy build to deploy directly on Plesk without vendor lock-in.
4. **Strict Color Theme:** Modern solid colors only. **NO GRADIENTS** or transitional color fades anywhere in the design. High-contrast industrial palette (CAT Gold, Deep Charcoal, Crisp White, Emerald Success, Slate Border).
5. **Exact Data Accuracy:** Full fidelity with J-Bone Industries' equipment rates, operating hour caps, overtime policies, attachments, delivery zones, and Arizona 811 legal disclosures.

---

## 2. Technology Stack & Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND (Next.js 15 App Router)            │
│  - React 19 / TypeScript / Tailwind CSS (Solid Colors Only) │
│  - Lucide React Icons / Headless UI / Canvas Signature Pad  │
│  - Mobile-First Responsive Design                           │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│    CORE CLIENT EXPERIENCES   │ │    OPERATOR / ADMIN SYSTEM  │
│ • Equipment Fleet & Specs    │ │ • Today's Dispatch Hub      │
│ • Instant Quote Calculator   │ │ • Lead Pipeline & CRM       │
│ • 48-Hour Booking Hold Flow  │ │ • Booking Calendar Timeline │
│ • Arizona Digital Agreements │ │ • Permit Leads Import (AZ)  │
│ • 24/7 AI Rental Assistant   │ │ • Reviews & Automated SMS   │
└──────────────┬───────────────┘ └─────────────┬───────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVER ACTIONS & API LAYER (Node.js)           │
│  - Quote Engine (Dynamic Multi-Tier Optimization)           │
│  - Agreement Signing & SHA-256 Cryptographic Audit Hash     │
│  - AI Gateway (Vercel AI SDK / Gemini / Claude API)         │
│  - Maricopa County Permit Parser & Outbound Scorer          │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA STORAGE LAYER                     │
│  • Primary DB: SQLite (via Prisma / Drizzle) or PostgreSQL  │
│  • Storage: Vercel Postgres / Supabase / Local SQLite       │
│  • PDF Receipts & Agreements: Frozen Snapshot JSON + PDF    │
└─────────────────────────────────────────────────────────────┘
```

### Stack Breakdown:
* **Framework:** Next.js 15 (App Router with Server Components & Server Actions)
* **Language:** TypeScript 5.x
* **Styling:** Tailwind CSS (Strictly solid color tokens: No `bg-gradient-*` classes)
* **Icons:** `lucide-react`
* **Form & Validation:** `zod` + `react-hook-form`
* **Signature Pad:** HTML5 Canvas (`react-signature-canvas` or vanilla lightweight HTML5 canvas implementation)
* **Database & ORM:** Drizzle ORM or Prisma with SQLite (local development / single-file deploy) or PostgreSQL (Vercel Postgres / Supabase)
* **AI Engine:** Vercel AI SDK (`ai` package) with Gemini 1.5 Flash / Claude 3.5 Sonnet support
* **Staging Environment:** Vercel (`azrentalguy.vercel.app`)
* **Production Environment:** Plesk Node.js Application Manager (Phusion Passenger or PM2 Reverse Proxy on `azrentalguy.com`)

---

## 3. Brand Identity & Design System (Solid Colors Only)

Per the strict requirement: **Solid colors only. No gradients or soft color fades.**

### Color Palette (Tokens)
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **CAT Industrial Gold** | `#E5A919` | Primary action buttons, badge accents, focal highlights |
| **Dark Gold Hover** | `#CA8A04` | Solid hover state for primary buttons |
| **Industrial Charcoal** | `#0F172A` | Primary text, deep dark headers, solid contrast backgrounds |
| **Slate Navy** | `#1E293B` | Secondary dark background, card borders, footer |
| **Light Slate Neutral** | `#F8FAFC` | Page canvas background, subtle section separators |
| **Pure White** | `#FFFFFF` | Card containers, input backgrounds, modal surfaces |
| **Steel Gray Border** | `#E2E8F0` | High-definition card borders, dividing lines |
| **Safety Red** | `#DC2626` | Warnings, damage alerts, overtime flags, cancellation |
| **Operational Emerald** | `#16A34A` | Availability tags, confirmed bookings, signed status |
| **Valley Blue** | `#2563EB` | Informational callouts, Arizona 811 badges, permit alerts |

### Typography & Structure
* **Font Family:** `Inter`, `system-ui`, `-apple-system`, `sans-serif` (Clean, legible, modern heavy-duty industrial look).
* **Radii:** Uniform `rounded-lg` (8px) and `rounded-xl` (12px). Sharp, crisp, solid borders (`border-2 border-slate-200`).
* **Elevation:** Solid flat borders and crisp 1px offset drop shadows (`shadow-sm`, `shadow-md`), eliminating fuzzy gradient shadows.

---

## 4. Accurate Equipment Fleet & Rate Specifications

The site uses live, verified data from J-Bone Industries (`azrentalguy.com`):

### 1. CAT 259D3 Compact Track Loader
* **Description:** Powerful, versatile compact track loader engineered for heavy earthmoving, landscaping, excavation, and grading in rugged Arizona desert conditions.
* **Engine & Specs:** CAT C3.3B DIT Turbo Diesel, 74.3 hp (55.4 kW), operating weight 8,987 lbs.
* **Rates:**
  * **Daily (up to 8 operating hours):** $450
  * **Weekly (up to 40 operating hours):** $1,300
  * **Monthly / 4-Week (up to 160 operating hours):** $3,150
* **Overtime Rate:** $75.00 / hour exceeding threshold
* **Delivery:** $150 flat fee within local Valley service area
* **Required Disclosures:** Arizona 811 "Call Before You Dig", Track wear guidelines, Daily grease & fuel requirements.

### 2. 2021 John Deere 4044M Utility Tractor
* **Description:** Dependable 44-hp 4WD utility tractor with heavy front-end loader. Ideal for property maintenance, grading, soil prep, and hauling.
* **Rates:**
  * **Daily (up to 8 operating hours):** $300
  * **Weekly (up to 40 operating hours):** $1,000
  * **Monthly / 4-Week (up to 160 operating hours):** $1,700
* **Available Attachments:**
  * Heavy-duty Pallet Forks: +$50/day or +$100/week
  * Gannon Box Scraper Attachment: +$50/day or +$100/week
* **Overtime Rate:** $75.00 / hour exceeding threshold

### 3. Multi-Quip WT5C 500-Gallon Water Trailer
* **Description:** DOT-compliant 500-gallon mobile water trailer with Honda engine-driven centrifugal pump, front/rear spray bars, and fire hose nozzle. Perfect for dust control, soil compaction, and site safety.
* **Rates:**
  * **Daily:** $150
  * **Weekly:** $450
  * **Monthly / 4-Week:** $1,000
* **Required Disclosures:** Towing vehicle class requirements, winter freeze drain policy, non-potable water warning.

### 4. 2025 Load Trail Gooseneck Deckover Heavy Equipment Trailer
* **Description:** Commercial heavy-duty gooseneck trailer with monster flip-over ramps, dual 10,000 lb Dexter axles, and heavy tie-down D-rings for hauling heavy machinery across the Valley.
* **Rates:**
  * **Daily:** $175
  * **Weekly:** $700
  * **Monthly / 4-Week:** $2,300
* **Required Disclosures:** Tow vehicle GVWR rating, commercial tie-down inspection, prohibited hazardous materials.

### Standard Universal Policies:
* **Valley-Wide Delivery & Pickup:** $150 flat fee (Phoenix, Scottsdale, Cave Creek, Mesa, Chandler, Gilbert, Glendale, Peoria, Surprise, Anthem, Buckeye).
* **Security Deposit:** $500 pre-authorization hold (released upon clean, undamaged return).
* **Damage Waiver (Optional):** 10% of base rental (covers accidental machine damage, zero deductible, excludes negligence).
* **Sales & Rental Tax:** 8.6% (Maricopa County / Arizona equipment rental tax rate).
* **Fuel & Cleanliness:** Delivered full of diesel/gas; must be returned full or billed at $8.00/gal. Basic dust is acceptable; heavy concrete/hardened mud incurs a $150 wash fee.

---

## 5. Phased Implementation Roadmap

```
PHASE 1: Modern Frontend & Catalog UI
├── Brand Solid Design Tokens (No Gradients)
├── Header & Navigation (Call CTA, Equipment Menu, Quick Quote)
├── Hero Section with Value Props (Valley-Wide Delivery, Same Day)
├── Equipment Catalog Grid & Machine Detail Modals
├── Valley Service Area Coverage Map & Zip Checker
└── Trust Badges, Customer Testimonials & Arizona FAQ

PHASE 2: Instant Pricing & Optimization Engine
├── Best-Rate Algorithm (Daily vs Weekly vs 4-Week lowest cost)
├── Addon Calculation (Attachments, Delivery $150, Damage Waiver 10%)
├── Tax Engine (8.6% Maricopa County Rental Tax)
├── Security Deposit Logic ($500 Hold)
└── Interactive Real-Time Quote Calculator Component

PHASE 3: Booking Flow & Arizona Digital Rental Agreement
├── 48-Hour Reservation Hold System
├── Equipment-Specific Legal Disclosures:
│   ├── Arizona 811 "Call Before You Dig" Dig-Law Acknowledgement
│   ├── Towing & Vehicle GVWR Legal Capacity Rules
│   └── Prohibited Hazardous Materials / Weight Limit Disclosures
├── Mobile-Friendly HTML5 Canvas Signature Pad
├── Cryptographic SHA-256 Agreement Integrity Hash + Timestamp + IP Capture
└── Automated Confirmation & Agreement Archival

PHASE 4: 24/7 AI Rental Assistant & Lead Generation Bot [STATUS: SKIPPED / ON HOLD (Client Decision - Preserved for Future)]
├── Floating Industrial Chat Widget (On Hold)
├── Natural Language Equipment Recommendation ("I need to clear 1 acre in Cave Creek") (On Hold)
├── Math-Locked Pricing Integration (AI uses pricing engine; never invents numbers) (On Hold)
├── Instant Lead Capture (Name, Phone, Email, Delivery Zip) (On Hold)
├── 1-Click "Book These Dates" Pre-Fill Transition (On Hold)
└── Automated Lead Dispatch Notification (Email/SMS to J-Bone) (On Hold)

PHASE 5: Operator CRM & Dispatch Dashboard (`/admin`) [STATUS: COMPLETE]
├── Operator Security & Auth Gate (`/admin/login` with admin / azrentaladmin validation) - Complete
├── Today's Operations Hub & GA4-Style Analytics (Smooth Catmull-Rom Curve, Grounded Guideline) - Complete
├── Dispatch & Delivery Multi-Date Management (Today, Tomorrow, Yesterday, This Week, Past Records + Date Picker) - Complete
├── Scalable Paginated Data Tables Across All Pages (Default 10 Entries, Search, Filters) - Complete
├── Lead Pipeline Kanban Board & Data Table Toggle (New, Contacted, Quoted, Reserved, Closed) - Complete
├── Visual Fleet Availability Timeline (14-Day Gantt + Bookings Data Table) - Complete
├── Maricopa County Permit Pipeline (Import CSV, AI Lead Scoring & SMS Drafts) - Complete
├── Automated Review Booster (Post-Return Google Review SMS trigger) - Complete
└── System & Operator Settings Page (`/admin/settings` - Logo Scale, Fonts, Timezones, Delivery Fees, Password Management) - Complete

PHASE 6: Staging Deployment (Vercel) & Plesk Transfer Plan
├── Vercel Staging Environment Setup & Configuration
├── Environment Secrets (AI Key, DB URL, Resend/Twilio Keys)
├── Plesk Node.js Passenger / PM2 Production Configuration
└── Domain Transfer, SSL Certificate & DNS Cutover Protocol
```

---

## 6. Detailed Phase Breakdown

### Phase 1: High-Conversion Modern Frontend
* **Goal:** Deliver an ultra-modern, crisp, mobile-responsive frontend that highlights J-Bone Industries' equipment, reliability, and Valley-wide delivery.
* **Key Tasks:**
  1. Setup Next.js 15 App structure with Tailwind CSS (Strict solid color configuration: `#E5A919`, `#0F172A`, `#1E293B`, `#FFFFFF`, `#F8FAFC`).
  2. Implement Sticky Header with direct click-to-call: `(707) 326-5592`, quick-quote CTA, and equipment shortcuts.
  3. Hero Section: "Heavy Equipment Rental Built for Arizona Jobs — Valley-Wide Delivery Direct to Your Jobsite."
  4. Interactive Equipment Showcase Cards:
     * High-res imagery, key machine specs (HP, weight, engine).
     * Clear daily, weekly, and 4-week pricing tags.
     * "Get Instant Quote" and "Reserve Hold" action buttons.
  5. Valley Service Area Map & Zip Code Checker: Instant confirmation of the $150 delivery zone across Maricopa County.
  6. Trust Elements: Arizona family-operated, fully insured, 5-star service ratings, contractor-grade reliability.

### Phase 2: Instant Pricing & Optimization Engine
* **Goal:** A transparent, reliable calculation engine that finds the customer the cheapest combination of rental periods and accounts for all fees.
* **Pricing Math Formula:**
  $$\text{Rental Days} = \Delta(\text{End Date}, \text{Start Date}) + 1$$
  $$\text{Months} = \lfloor\text{Days} / 28\rfloor, \quad \text{Rem}_1 = \text{Days} \pmod{28}$$
  $$\text{Weeks} = \lfloor\text{Rem}_1 / 7\rfloor, \quad \text{Rem}_2 = \text{Rem}_1 \pmod{7}$$
  $$\text{Base Cost} = \min(\text{Uncapped Daily Cost}, \text{Optimized Tier Mix})$$
  $$\text{Subtotal} = \text{Base Cost} + \text{Attachments} + \text{Delivery Flat (\$150)}$$
  $$\text{Waiver (Optional)} = 0.10 \times (\text{Base Cost} + \text{Attachments})$$
  $$\text{Tax (8.6\%)} = 0.086 \times (\text{Subtotal} + \text{Waiver})$$
  $$\text{Grand Total} = \text{Subtotal} + \text{Waiver} + \text{Tax}$$
  $$\text{Hold Deposit (Refundable)} = \$500.00$$

### Phase 3: Arizona Digital Rental Agreement & Signing Flow
* **Goal:** Eliminate paperwork friction by generating a legally binding, mobile-friendly digital agreement upon reservation.
* **Key Components:**
  1. **Arizona 811 Excavation Disclosure:** Arizona law (A.R.S. § 40-360.21) mandates calling 811 at least two full working days prior to digging. The signer must explicitly check this before completing a CAT 259D3 rental.
  2. **Trailer Towing & Weight Limits:** Acknowledges driver has a Class A/proper hitch, brake controller, and adequate towing vehicle rating.
  3. **Hazardous Waste Exclusion:** Prohibits paints, chemicals, tires, batteries, and asbestos in trailers or dump containers.
  4. **Digital Signature Pad:** Smooth touch-enabled HTML5 canvas with clear/save controls.
  5. **Cryptographic Proof Stamp:** Generates a SHA-256 hash containing:
     $$\text{SHA-256}(\text{Customer Name} + \text{Timestamp} + \text{IP Address} + \text{Agreement Text} + \text{Signature Vector})$$
     Stored permanently in the database and rendered on the downloadable confirmation receipt.

### Phase 4: 24/7 AI Rental Assistant & Lead Generator [STATUS: SKIPPED / ON HOLD — Client Decision]
> **Client Directive (Skipped / Preserved):** The client confirmed that a chatbot is not needed for the current launch to maintain a fast, clean, contractor-focused booking experience. This phase is officially skipped / put on hold. All technical requirements, API integrations, and prompt schemas are fully preserved below so they can be activated immediately if the client requests this feature in the future.
* **Goal:** Turn website visitors into booked jobs 24 hours a day with an intelligent, friendly chat assistant.
* **Capabilities:**
  1. Understands job requirements: e.g., "I need to level a 10,000 sq ft lot in Cave Creek with rocky soil" -> Recommends CAT 259D3 + Gannon tractor scraper.
  2. Queries the pricing engine dynamically to deliver exact dollar-accurate quotes.
  3. Captures lead information (Name, Phone number, Jobsite location) and passes it directly to the CRM.
  4. Provides a 1-click **"Book These Dates"** button that pre-populates the checkout modal.

### Phase 5: Operator CRM & Admin Operations Dashboard (`/admin`) [STATUS: 100% COMPLETE]
* **Goal:** A clean, high-impact operations command center for J-Bone Industries with persistent light sidebar navigation, Red & Gold theme, uniform element heights, and scalable Data Tables ready for future large datasets.
* **Views & Components Built:**
  1. **Persistent Sidebar & Layout (`/admin`):** Crisp white sidebar with Red (`#DC2626`) and Gold (`#E5A919`) active states, live Arizona MST clock, clean navigation links, interactive 48-Hr Hold countdown badge, and "+ New Lead" modal.
  2. **Performance Monitoring Dashboard (`/admin`):** Top 4 rental KPI cards, continuous Google Analytics-style SVG line chart (Revenue / Bookings / Quotes), Equipment fleet breakdown, and scalable Invoices Data Table with live search, status filter, CSV export, and "Show [10/25/50/100] entries" pagination (default 10).
  3. **Today's Dispatch & Deliveries (`/admin/dispatch`):** Focused single Data Table for outbound deliveries and returns with live search, status filter, and pagination (default 10 entries). Active 48-Hour Reservation Holds cleanly housed in a dedicated, fast modal dialog with 1-click SMS reminder and release actions.
  4. **Contractor Pipeline CRM (`/admin/pipeline`):** Scalable Data Table (with view toggle to Kanban board) featuring search, 6-stage filter, machine selector, priority badges, and pagination (default 10 entries). Uniform `h-10` header pills for Pipeline Value and Active/Signed totals.
  5. **Fleet Availability Timeline & Bookings (`/admin/calendar`):** 14-day interactive Gantt schedule + scalable Fleet Bookings Data Table with search, status filter, and pagination (default 10 entries).
  6. **Maricopa County Permit Pipeline (`/admin/permits`):** Scalable county permits Data Table with match scorer, search, status filter, pagination (default 10 entries), and 1-click AI Outreach SMS Pitch modal.
  7. **Google Review Booster (`/admin/reviews`):** Scalable 24-hr post-return automated SMS queue Data Table with search, status filter, pagination (default 10 entries), SMS template customizer, and recent verified customer reviews.
  8. **Fleet & Equipment Pricing Manager (`/admin/fleet`):** Equipment inventory control room with multi-image upload dropzone, angle photo gallery grid, preset machine angle loaders, primary cover photo selection, real-time rate overrides, engine hour meters, and Arizona 811 requirement toggles.
  9. **System & Operator Settings (`/admin/settings`):** Global controls for company legal entity, logo sizing, Arizona MST timezone, typography scaling, universal deposit & fee rates, and operator password management.
  10. **Operator User Manual & Interactive Guide (`/admin/manual`):** Beginner-friendly, tabbed operator guide explaining the exact purpose, step-by-step instructions, and operational tips for every page.
  11. **Branded SweetAlert2 Modal Dialogs:** Custom red & gold confirmation and alert modals replacing native browser alerts throughout the system.

### Phase 6: Database & Backend Architecture (NEXT PHASE — Pending Client UI Approval)
* **Goal:** Transition the platform from client-side mock/localStorage data into a persistent, production-grade backend engine before production cutover to Plesk.
* **Key Tasks:**
  1. **Database Schema & ORM Setup:** Configure Prisma or Drizzle ORM with PostgreSQL or SQLite. Create robust schemas for `Equipment`, `Bookings`, `Holds`, `Invoices`, `Leads`, `CountyPermits`, and `Settings`.
  2. **Real Data Persistence & API Migration:** Replace `localStorage` operations with secure Next.js Server Actions and REST API routes (`/api/fleet`, `/api/bookings`, `/api/leads`, `/api/settings`).
  3. **Secure Admin Authentication:** Implement hashed credentials (bcrypt/argon2), JWT session tokens, role-based route protection, and CSRF security.
  4. **Automated Notification Services:** Connect Twilio SMS API for 48-hour reservation hold expiration warnings and SendGrid/Resend for automated PDF rental agreement receipts.
  5. **County Permit Scraper API:** Automated sync for Maricopa County excavation permits.

### Phase 7: Plesk Production Deployment & Domain Cutover
* **Vercel Staging:**
  * GitHub repository connected: `https://github.com/Aian24/azrentalguy`
  * Live staging preview: `https://azrentalguy.vercel.app/`
* **Plesk Production Cutover:**
  * Option A: Plesk Node.js Application Manager with Phusion Passenger (Node 20+).
  * Option B: Next.js standalone build managed via PM2 behind Nginx reverse proxy.
  * SSL Certificate verification and zero-downtime DNS transfer to `azrentalguy.com`.

---

## 7. Deliverables & Progress Verification

| Deliverable | Description | Verification Method |
| :--- | :--- | :--- |
| **`PLAN.md`** | Master architectural roadmap & requirements specification | Verified in workspace |
| **`project-tracker.html`** | Interactive solid-color monitoring dashboard with local storage persistence | Open in browser, verify task toggles & metrics |
| **Next.js Core Application** | Modern frontend, catalog, quote calculator, signature pad | Vercel preview & local build verification |
| **Phase 4: AI Rental Assistant** | 24/7 Chatbot & automated lead generator | **Skipped / On Hold** per client decision (preserved in plan) |
| **Phase 5: Admin Operations (`/admin`)** | Full 8-page admin suite (Dispatch, Pipeline, Calendar, Permits, Reviews, Fleet, Settings, Manual) | **100% COMPLETE** & Verified (`npm run build`) |
| **Phase 6: Database & Backend** | Real database tables, Server Actions, auth, and notification integrations | **READY TO BUILD** (Next Phase upon Client Approval) |
| **Phase 7: Plesk Transfer** | Production environment configuration & live domain cutover | Documented in Plan & Tracker |

---
*Created for J-Bone Industries / AZ Rental Guy project lead & development team.*

