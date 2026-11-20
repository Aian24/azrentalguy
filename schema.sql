-- =====================================================================
-- AZ Rental Guy (J-Bone Industries) - Production MariaDB / MySQL Schema
-- Host: localhost:3306 | Target: Plesk MariaDB
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. EQUIPMENT FLEET TABLE
CREATE TABLE IF NOT EXISTS `equipments` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(64) NOT NULL,
  `dailyRate` DECIMAL(10,2) NOT NULL,
  `weeklyRate` DECIMAL(10,2) NOT NULL,
  `monthlyRate` DECIMAL(10,2) NOT NULL,
  `overtimeRate` DECIMAL(10,2) NOT NULL DEFAULT 75.00,
  `serialNumber` VARCHAR(128) NOT NULL,
  `engineHours` DECIMAL(8,1) NOT NULL DEFAULT 0.0,
  `yardStatus` VARCHAR(64) NOT NULL DEFAULT 'Available in Yard',
  `engineSpecs` VARCHAR(255) NOT NULL,
  `operatingWeight` VARCHAR(128) NOT NULL,
  `image` TEXT NOT NULL,
  `images` LONGTEXT NULL,
  `tagline` VARCHAR(255) NULL,
  `requiresDigLaw` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(64) NOT NULL,
  `equipmentId` VARCHAR(64) NOT NULL,
  `equipmentName` VARCHAR(255) NOT NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255) NULL,
  `phone` VARCHAR(64) NOT NULL,
  `email` VARCHAR(255) NULL,
  `jobsiteAddress` VARCHAR(255) NOT NULL,
  `startDate` VARCHAR(32) NOT NULL,
  `endDate` VARCHAR(32) NOT NULL,
  `status` VARCHAR(64) NOT NULL DEFAULT 'reserved',
  `quotedAmount` DECIMAL(10,2) NOT NULL,
  `totalAmount` DECIMAL(10,2) NOT NULL,
  `notes` TEXT NULL,
  `signatureData` MEDIUMTEXT NULL,
  `auditHash` VARCHAR(128) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 48-HOUR RESERVATION HOLDS TABLE
CREATE TABLE IF NOT EXISTS `reservation_holds` (
  `id` VARCHAR(64) NOT NULL,
  `bookingId` VARCHAR(64) NULL,
  `equipmentId` VARCHAR(64) NOT NULL,
  `equipmentName` VARCHAR(255) NOT NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `startDate` VARCHAR(32) NOT NULL,
  `endDate` VARCHAR(32) NOT NULL,
  `totalAmount` DECIMAL(10,2) NOT NULL,
  `hoursRemaining` INT NOT NULL DEFAULT 48,
  `signatureStatus` VARCHAR(64) NOT NULL DEFAULT 'pending',
  `expires_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CONTRACTOR PIPELINE LEADS TABLE
CREATE TABLE IF NOT EXISTS `pipeline_leads` (
  `id` VARCHAR(64) NOT NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255) NULL,
  `phone` VARCHAR(64) NOT NULL,
  `email` VARCHAR(255) NULL,
  `equipmentName` VARCHAR(255) NOT NULL,
  `jobsiteAddress` VARCHAR(255) NOT NULL,
  `quotedAmount` DECIMAL(10,2) NOT NULL,
  `stage` VARCHAR(64) NOT NULL DEFAULT 'inquired',
  `priority` VARCHAR(64) NOT NULL DEFAULT 'normal',
  `startDate` VARCHAR(32) NULL,
  `endDate` VARCHAR(32) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. DISPATCH RUN SHEET TABLE
CREATE TABLE IF NOT EXISTS `dispatches` (
  `id` VARCHAR(64) NOT NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255) NULL,
  `phone` VARCHAR(64) NOT NULL,
  `equipmentName` VARCHAR(255) NOT NULL,
  `equipmentId` VARCHAR(64) NOT NULL,
  `jobsiteAddress` VARCHAR(255) NOT NULL,
  `scheduledDate` VARCHAR(32) NOT NULL,
  `scheduledTime` VARCHAR(64) NOT NULL,
  `returnDate` VARCHAR(32) NOT NULL,
  `driver` VARCHAR(128) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(64) NOT NULL DEFAULT 'scheduled',
  `type` VARCHAR(64) NOT NULL DEFAULT 'delivery',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. COUNTY PERMITS TABLE
CREATE TABLE IF NOT EXISTS `permits` (
  `id` VARCHAR(64) NOT NULL,
  `permitNumber` VARCHAR(64) NOT NULL,
  `contractorName` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `city` VARCHAR(64) NOT NULL,
  `jobsiteAddress` VARCHAR(255) NOT NULL,
  `projectType` TEXT NOT NULL,
  `valuation` VARCHAR(64) NOT NULL,
  `recommendedEquipment` VARCHAR(255) NOT NULL,
  `matchScore` INT NOT NULL DEFAULT 85,
  `status` VARCHAR(64) NOT NULL DEFAULT 'new',
  `aiPitchDraft` TEXT NOT NULL,
  `issuedDate` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. REVIEW SMS QUEUE TABLE
CREATE TABLE IF NOT EXISTS `reviews_queue` (
  `id` VARCHAR(64) NOT NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `equipmentName` VARCHAR(255) NOT NULL,
  `returnDate` VARCHAR(32) NOT NULL,
  `queueStatus` VARCHAR(64) NOT NULL DEFAULT 'queued',
  `sentAt` VARCHAR(64) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. INVOICES TABLE
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` VARCHAR(64) NOT NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255) NULL,
  `equipmentName` VARCHAR(255) NOT NULL,
  `jobsite` VARCHAR(255) NOT NULL,
  `paymentMethod` VARCHAR(64) NOT NULL DEFAULT 'Visa ending in 4092',
  `amount` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(64) NOT NULL DEFAULT 'Paid',
  `date` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. APP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS `app_settings` (
  `id` VARCHAR(64) NOT NULL DEFAULT 'primary',
  `data` LONGTEXT NULL,
  `companyName` VARCHAR(255) NOT NULL DEFAULT 'AZ Rental Guy (J-Bone Industries)',
  `logoUrl` VARCHAR(255) NOT NULL DEFAULT '/images/logo.png',
  `logoSize` INT NOT NULL DEFAULT 32,
  `supportPhone` VARCHAR(64) NOT NULL DEFAULT '(707) 326-5592',
  `supportEmail` VARCHAR(255) NOT NULL DEFAULT 'jbone@azrentalguy.com',
  `yardAddress` VARCHAR(255) NOT NULL DEFAULT '42410 N Cave Creek Rd, Cave Creek, AZ 85331',
  `timezone` VARCHAR(64) NOT NULL DEFAULT 'America/Phoenix',
  `salesTaxRate` DECIMAL(6,4) NOT NULL DEFAULT 0.0860,
  `damageWaiverRate` DECIMAL(6,4) NOT NULL DEFAULT 0.1000,
  `deliveryFee` DECIMAL(10,2) NOT NULL DEFAULT 150.00,
  `securityDeposit` DECIMAL(10,2) NOT NULL DEFAULT 500.00,
  `pin` VARCHAR(64) NOT NULL DEFAULT '1984',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- INITIAL SEED DATA (J-BONE INDUSTRIES LIVE FLEET & SETTINGS)
-- =====================================================================

INSERT INTO `app_settings` (`id`, `companyName`, `logoUrl`, `logoSize`, `supportPhone`, `supportEmail`, `yardAddress`, `timezone`, `salesTaxRate`, `damageWaiverRate`, `deliveryFee`, `securityDeposit`, `pin`)
VALUES ('primary', 'AZ Rental Guy (J-Bone Industries)', '/images/logo.png', 32, '(707) 326-5592', 'jbone@azrentalguy.com', '42410 N Cave Creek Rd, Cave Creek, AZ 85331', 'America/Phoenix', 0.0860, 0.1000, 150.00, 500.00, '1984')
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

INSERT INTO `equipments` (`id`, `name`, `category`, `dailyRate`, `weeklyRate`, `monthlyRate`, `overtimeRate`, `serialNumber`, `engineHours`, `yardStatus`, `engineSpecs`, `operatingWeight`, `image`, `images`, `tagline`, `requiresDigLaw`)
VALUES
('cat-259d3', 'CAT 259D3 Compact Track Loader', 'Track Loader', 450.00, 1300.00, 3150.00, 75.00, 'CAT-259D3-AZ-4921', 194.5, 'On Jobsite', '74.3 hp CAT C3.3B Turbo Diesel', '8,987 lb (ROC: 2,010 lb)', '/images/cat-ontrailer.webp', '["/images/cat-ontrailer.webp","/images/cat-front.webp","/images/cat-side.webp","/images/cat-back.webp"]', 'Heavy-duty track loader ready for Valley jobsites.', 1),
('cat-226d3', '2021 Cat 226D3 Skid Steer Loader', 'Skid Steer', 275.00, 1000.00, 1650.00, 75.00, 'AZR-2022-08', 312.0, 'Available in Yard', 'Tier 4 Diesel Engine (67.1 hp)', '5,849 lb (ROC: 1,550 lb)', '/images/equipments/2021 Cat 226D3/1.jpg', '["/images/equipments/2021 Cat 226D3/1.jpg","/images/equipments/2021 Cat 226D3/2.jpg","/images/equipments/2021 Cat 226D3/3.jpg","/images/equipments/2021 Cat 226D3/4.jpg","/images/equipments/2021 Cat 226D3/5.jpg"]', 'Agile, powerful wheeled skid steer ideal for tight access sites.', 1),
('john-deere-4044m', '2021 John Deere 4044M Tractor', 'Utility Tractor', 300.00, 1000.00, 1700.00, 75.00, 'JD-4044M-AZ-1182', 442.1, 'Available in Yard', '43 hp Yanmar 4-Cyl Diesel', '3,770 lb + Loader Bucket', '/images/jd-4044.webp', '["/images/jd-4044.webp"]', 'Versatile tractor equipped for grading, scraping, and property care.', 0),
('multiquip-wt5c', 'Multi-Quip WT5C 500-Gallon Water Trailer', 'Water Trailer', 150.00, 450.00, 1000.00, 0.00, 'WT-500-AZ-8831', 88.0, 'Available in Yard', 'Honda GX160 High-Pressure Pump', '6,200 lb (Full Tank)', '/images/water-trailer.webp', '["/images/water-trailer.webp"]', 'Dust suppression and compaction water trailer with rear spray bar.', 0),
('load-trail-gooseneck', '2025 Load Trail Gooseneck Deck-Over Trailer', 'Equipment Trailer', 175.00, 700.00, 1500.00, 0.00, 'LT-GN-2025-019', 0.0, 'Available in Yard', 'Dual 10,000 lb Dexter Axles (Electric Brakes)', '24,000 lb GVWR', '/images/trailer.webp', '["/images/trailer.webp"]', 'Heavy commercial equipment hauling with hydraulic monster ramps.', 0)
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- Sample Holds
INSERT INTO `reservation_holds` (`id`, `equipmentId`, `equipmentName`, `customerName`, `phone`, `startDate`, `endDate`, `totalAmount`, `hoursRemaining`, `signatureStatus`)
VALUES
('HLD-801', 'cat-259d3', 'CAT 259D3 Compact Track Loader', 'Brandon Miller', '(602) 555-0144', '2026-11-20', '2026-11-24', 1450.00, 10, 'pending'),
('HLD-802', 'cat-226d3', '2021 Cat 226D3 Skid Steer', 'Dave Henderson', '(480) 555-7821', '2026-11-21', '2026-11-23', 975.00, 18, 'signed')
ON DUPLICATE KEY UPDATE `created_at` = `created_at`;

-- Sample Pipeline Leads
INSERT INTO `pipeline_leads` (`id`, `customerName`, `companyName`, `phone`, `email`, `equipmentName`, `jobsiteAddress`, `quotedAmount`, `stage`, `priority`, `startDate`, `endDate`)
VALUES
('LD-501', 'Dave Miller', 'Miller Grading Services', '(602) 555-4411', 'dave@millergrading.com', 'CAT 259D3 Compact Track Loader', '5600 W Olive Ave, Glendale, AZ', 1450.00, 'active', 'urgent', '2026-11-19', '2026-11-23'),
('LD-502', 'Tom Bradley', 'Bradley Horse Stables', '(480) 555-8844', 'tom@bradleys.com', 'Multi-quip WT5C Water Trailer', '32000 N Tom Darlington Dr, Carefree, AZ', 600.00, 'quoted', 'high', '2026-11-20', '2026-11-24'),
('LD-503', 'Carlos Ortiz', 'Desert Horizon Landscaping', '(623) 555-9012', 'carlos@deserthorizon.com', '2021 Cat 226D3 Skid Steer', '8900 E Dynamite Blvd, Scottsdale, AZ', 1150.00, 'agreement_sent', 'urgent', '2026-11-20', '2026-11-22')
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- Sample Invoices
INSERT INTO `invoices` (`id`, `customerName`, `companyName`, `equipmentName`, `jobsite`, `paymentMethod`, `amount`, `status`, `date`)
VALUES
('INV-2024-001', 'Apex Earthworks LLC', 'Apex Earthworks', 'CAT 259D3 Compact Track Loader', '18200 N Scottsdale Rd, Scottsdale, AZ', 'Direct ACH Wire', 3150.00, 'Paid', 'Nov 18, 2026'),
('INV-2024-002', 'Desert Edge Contracting', 'Desert Edge Contracting', 'Multi-quip WT5C 500-gal Water Trailer', '4100 W Carefree Hwy, Phoenix, AZ', 'Visa ending in 9104', 1450.00, 'Paid', 'Nov 17, 2026'),
('INV-2024-003', 'Miller Grading Services', 'Miller Grading Services', 'CAT 259D3 Compact Track Loader', '5600 W Olive Ave, Glendale, AZ', 'Amex ending in 3301', 1450.00, 'Paid', 'Nov 19, 2026')
ON DUPLICATE KEY UPDATE `date` = `date`;

SET FOREIGN_KEY_CHECKS = 1;
