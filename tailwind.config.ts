import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          gold: "#E5A919",
          "gold-hover": "#CA8A04",
          "gold-dark": "#A16207",
          "gold-light": "#FEF3C7",
          text: "#0F172A",
        },
        industrial: {
          950: "#090D16",
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
          200: "#E2E8F0",
          100: "#F1F5F9",
          50: "#F8FAFC",
        },
        safety: {
          green: "#10B981",
          red: "#EF4444",
          blue: "#2563EB",
          amber: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};

export default config;

