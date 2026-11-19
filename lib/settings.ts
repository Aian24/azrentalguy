// GLOBAL SYSTEM & OPERATOR SETTINGS
export interface AppSettings {
  // BRANDING & LOGO
  companyName: string;
  legalEntityName: string;
  tagline: string;
  logoUrl: string;
  logoSize: number; // in pixels (height: 24 to 72)

  // TIME & LOCALIZATION
  timeZone: string;
  timeFormat: "12h" | "24h";
  dateFormat: "MM/DD/YYYY" | "YYYY-MM-DD" | "DD/MM/YYYY";

  // TYPOGRAPHY (BACKEND & FRONTEND)
  fontFamily: "inter" | "jakarta" | "roboto" | "oswald" | "system";
  fontSize: "compact" | "standard" | "large" | "spacious";

  // RENTAL PRICING & DEPOSITS
  deliveryFee: number;
  depositAmount: number;
  waiverRate: number; // percentage (e.g. 10)
  taxRate: number; // percentage (e.g. 8.6)
  overtimeHourlyRate: number;

  // YARD & CONTACT
  dispatchPhone: string;
  dispatchEmail: string;
  yardAddress: string;
  yardHours: string;
  az811Mandatory: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  companyName: "AZ Rental Guy",
  legalEntityName: "J-Bone Industries LLC",
  tagline: "Heavy Equipment Rental Built for Arizona Jobs — Valley-Wide Delivery",
  logoUrl: "/images/logo.webp",
  logoSize: 36,

  timeZone: "America/Phoenix",
  timeFormat: "12h",
  dateFormat: "MM/DD/YYYY",

  fontFamily: "inter",
  fontSize: "standard",

  deliveryFee: 150,
  depositAmount: 500,
  waiverRate: 10,
  taxRate: 8.6,
  overtimeHourlyRate: 75,

  dispatchPhone: "(707) 326-5592",
  dispatchEmail: "rentals@azrentalguy.com",
  yardAddress: "34820 N Cave Creek Rd, Cave Creek, AZ 85331",
  yardHours: "Mon-Sat: 6:00 AM - 6:00 PM (MST)",
  az811Mandatory: true,
};

const STORAGE_KEY = "az_admin_app_settings";

export function getStoredSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_APP_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_APP_SETTINGS;
    return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applySettingsToDOM(settings);
    window.dispatchEvent(new Event("app_settings_updated"));
  } catch (err) {
    console.error("Failed to save settings to localStorage", err);
  }
}

export function applySettingsToDOM(settings: AppSettings): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Font family mapping
  const fontClassMap: Record<AppSettings["fontFamily"], string> = {
    inter: "font-sans",
    jakarta: "font-sans",
    roboto: "font-sans",
    oswald: "font-mono",
    system: "font-sans",
  };

  // Base font size mapping
  const sizeMap: Record<AppSettings["fontSize"], string> = {
    compact: "13px",
    standard: "14px",
    large: "15px",
    spacious: "16px",
  };

  root.style.setProperty("--app-base-font-size", sizeMap[settings.fontSize] || "14px");
  root.style.setProperty("--app-logo-height", `${settings.logoSize}px`);
}

// OPERATOR PASSWORD MANAGEMENT
const PASSWORD_KEY = "az_admin_password";
const DEFAULT_PASSWORD = "azrentaladmin";

export function getAdminPassword(): string {
  if (typeof window === "undefined") return DEFAULT_PASSWORD;
  try {
    return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export function setAdminPassword(newPassword: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PASSWORD_KEY, newPassword);
  } catch (err) {
    console.error("Failed to store new admin password", err);
  }
}

