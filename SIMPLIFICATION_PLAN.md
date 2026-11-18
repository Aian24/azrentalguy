# Website Simplification & Accurate Equipment Alignment Plan
**AZ Rental Guy (J-Bone Industries LLC) — Contractor-Focused Fast Booking Overhaul**

---

## 1. Executive Summary & Client Directives

### Client Feedback:
> *"You need to simplify the website, it's too complex - people in this industry are busy and they want to find the equipment and book it quickly and easy. also the equipment titles are descriptions are wrong, we need to fix that."*

### Key Requirements:
1. **Accurate Equipment Data**: Synchronize titles, descriptions, specs, and attachments 100% with the original live website (`https://azrentalguy.com/`).
2. **Remove All Hero Sections**: Eliminate bulky hero banners across all pages so busy contractors land directly on the equipment and booking tools.
3. **Eliminate Duplicate Content**: Remove repeated marketing banners (specifically `"Valley-Wide Equipment Delivery For Just $150"`) found across multiple sections per page.
4. **Radical Simplification**: Remove clutter, redundant badges, and marketing fluff. Focus on fast machine discovery, transparent rates, and effortless 1-click booking.

---

## 2. Original Website Equipment Audit (`azrentalguy.com`)

The live site was scanned and extracted. Below is the ground truth for all fleet items:

| Original Site Title | Original Description & Specs | Attachments | Verified Rates |
| :--- | :--- | :--- | :--- |
| **CAT 259D3 Compact Track Loader** | "Powerful, versatile, and ready for your toughest jobs. Perfect for landscaping, grading, and construction projects."<br>• Engine: CAT C3.3B DIT Turbo Diesel (74.3 hp / 55.4 kW)<br>• Operating Weight: 8,987 lb (4,076 kg)<br>• Lift Capacity: 2,010 lb (915 kg)<br>• Lift Height: 121 in (3,075 mm) | Pallet Forks<br>(+$50/d, +$100/w) | **$450** / Day<br>**$1,300** / Wk<br>**$3,150** / Mo<br>*(Overtime: $75/h)* |
| **2021 John Deere 4044M** | "With loader bucket and grapple attachments. Perfect for landscaping or farm work."<br>• Engine: 44 hp, 3-cylinder Yanmar diesel, 101.3 CID<br>• Weight: ~2,800 lbs with loader<br>• Features: 4WD, foldable ROPS, hydrostatic steering, 12.3 gal fuel tank<br>• Loader: 44M loader with 1,400 lb lift capacity, 6.9 ft max height | Gannon Attachment<br>(+$50/d, +$100/w) | **$300** / Day<br>**$1,000** / Wk<br>**$1,700** / Mo<br>*(Overtime: $75/h)* |
| **Multi-quip WT5C 500-gallon water trailer** | "Use: Dust control, compaction, general water hauling."<br>• Capacity: 500 gallons (525-gal polyethylene tank)<br>• Pump: 2-inch QP2H centrifugal, 158 GPM flow<br>• Fill: 12-inch vented port, full in 5 minutes at max<br>• Trailer: Dual axle, DOT-approved, highway towable (~2,500 lbs empty) | Spray bar & hose included standard | **$150** / Day<br>**$450** / Wk<br>**$1,000** / Mo<br>*(Overtime: $75/h)* |
| **2025 Load Trail Gooseneck Deckover Trailer** | "26 ft overall length with hydraulic tilt deck (22 ft tilt section + 4 ft fixed front deck). Tandem 10K axles with electric brakes."<br>• Main Frame: 12 in I-beam (12,000 lb rating) with 3 in channel crossmembers<br>• Coupler: 2-5/16 in adjustable gooseneck ball coupler (30K rated)<br>• D-Rings: 16 total (4,400 lb rating each)<br>• Tires: ST235/80R16 Load Range G (tandem 10K axles) | Wireless remote hydraulic tilt | **$175** / Day<br>**$700** / Wk<br>**$2,300** / Mo<br>*(Unlimited hours)* |
| **2021 Cat 226D3 Skid Steer** *(New Yard Unit)* | "Enclosed cab with AC & stereo. Compact radial-lift skid steer."<br>• Engine: Cat C2.2 Diesel (67 hp)<br>• Operating Weight: 5,850 lb (1,550 lb ROC / 1,650 lb w/ counterweight)<br>• Ideal for tight residential gates, dirt, gravel, and property maintenance | Heavy Dirt Bucket standard | **$275** / Day<br>**$1,000** / Wk<br>**$1,650** / Mo<br>*(Overtime: $75/h)* |

---

## 3. Duplication Audit: Removing Repeated Content

Currently, `"Valley-Wide Equipment Delivery For Just $150"` and identical delivery statements appear **up to 6 times across the same pages**:
- Hero banner: *"Valley-Wide Equipment Delivery For Just $150 Flat"*
- HomeOverview section: *"Valley-Wide Equipment Delivery For Just $150"*
- Fleet showcase header: *"delivered anywhere in Maricopa County for $150 flat"*
- Pricing card footers: repeated delivery text
- Booking section: repeated delivery bullet points
- Footer & Map: repeated delivery claims

### Action:
1. **Single Point of Truth**: Keep delivery mentioned cleanly in the top bar / navbar and inside the actual booking price breakdown.
2. **Remove All Repetitive Marketing Slogans**: Strip the repeated banners from section intros across all pages.

---

## 4. Removing Hero Sections & Streamlining Layout

### Homepage (`app/page.tsx`):
```
[ BEFORE: Complex & Long ]               [ AFTER: Lean & Contractor-First ]
┌──────────────────────────────┐        ┌──────────────────────────────┐
│ Sticky Header & Phone        │        │ Compact Header (Logo + Phone)│
├──────────────────────────────┤        ├──────────────────────────────┤
│ ❌ Bulky Hero Section        │        │ ⭐ Equipment Fleet Grid       │
│    (Marketing text & badges) │        │    (Direct at top of screen) │
├──────────────────────────────┤        │    - 5 Clean Machine Cards   │
│ ❌ HomeOverview Intro        │        │    - Accurate Specs & Rates  │
│    (Duplicate delivery pitch)│        │    - [ Book Now ] Button     │
├──────────────────────────────┤        ├──────────────────────────────┤
│ HomeFleetShowcase            │        │ Fast 48-Hr Booking Section   │
├──────────────────────────────┤        │ (Instant date & rate quote)  │
│ PricingSection               │        ├──────────────────────────────┤
├──────────────────────────────┤        │ Compact Service Area & Map   │
│ BookingSection               │        ├──────────────────────────────┤
├──────────────────────────────┤        │ Clean Footer (Contact & Info)│
│ ServiceAreaMap & Testimonials│        └──────────────────────────────┘
└──────────────────────────────┘
```

### Inner Pages (`/equipment`, `/pricing`, `/book-now`, `/contact`):
- Remove all top hero intro banners.
- Immediately present the core tool or table (e.g., on `/equipment`, the grid begins immediately beneath the navigation).

---

## 5. Detailed Component Changes

### 1. `lib/fleet.ts`
- Update all 5 machines with **exact titles**, **concise 1-sentence descriptions**, and **original factory specs**.
- Remove marketing taglines and artificial adjectives.
- Attachments verified:
  - CAT 259D3: Pallet Forks (+$50/d, +$100/w)
  - John Deere 4044M: Gannon Box Scraper (+$50/d, +$100/w)

### 2. `components/Hero.tsx`
- Retire or remove completely from `app/page.tsx` and all inner routes.
- Replace with zero-gap immediate fleet presentation.

### 3. `components/HomeFleetShowcase.tsx`
- Remove the repetitive subheading *"Commercial machinery serviced, fully fueled, and delivered anywhere in Maricopa County for $150 flat."*
- Replace category tabs with simple, minimal category pills (`All`, `Loaders`, `Tractors`, `Trailers`).
- Card layout: Photo with carousel, exact machine title, 2-line factory spec, clean 3-tier rates (Daily / Weekly / Monthly), and direct `[ Book Now ]` button.

### 4. `components/PricingSection.tsx`
- Remove verbose marketing paragraphs and duplicate delivery headers.
- Keep only the clean 3-column pricing comparison grid with Daily, Weekly, and Monthly rates.

### 5. `components/BookingSection.tsx`
- Remove repeated value proposition paragraphs.
- Keep the clean 2-step booking calculator with instant total calculation and direct link to the Digital Agreement.

---

## 6. Implementation Checklist & Verification

```markdown
- [ ] 1. Update lib/fleet.ts with exact titles and descriptions from azrentalguy.com
- [ ] 2. Remove Hero.tsx and HomeOverview.tsx from app/page.tsx
- [ ] 3. Eliminate duplicate delivery text across all page headers and card subtexts
- [ ] 4. Streamline HomeFleetShowcase.tsx for immediate above-the-fold visibility
- [ ] 5. Simplify EquipmentCatalog.tsx and PricingSection.tsx (remove text walls)
- [ ] 6. Run TypeScript check (npx tsc --noEmit)
- [ ] 7. Run Next.js production build (npm run build)
- [ ] 8. Review and push to GitHub / Vercel staging
```
