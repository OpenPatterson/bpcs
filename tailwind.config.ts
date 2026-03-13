import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B3A6B",
          50: "#EBF0F7",
          100: "#D6E1EF",
          200: "#ADC3DF",
          300: "#84A5CF",
          400: "#5B87BF",
          500: "#3D6DA5",
          600: "#1B3A6B",
          700: "#152E55",
          800: "#0F2240",
          900: "#0A162A",
        },
        red: {
          DEFAULT: "#C8102E",
          50: "#FEF2F2",
          100: "#FDE6E6",
          200: "#F9BFBF",
          300: "#F59999",
          400: "#E04D5E",
          500: "#C8102E",
          600: "#A80D26",
          700: "#880A1E",
          800: "#680816",
          900: "#48050F",
        },
        surface: "#F8FAFC",
        card: "#FFFFFF",
        border: "#E2E8F0",
        text: "#0F172A",
        muted: {
          DEFAULT: "#64748B",
          foreground: "#64748B",
        },
        // shadcn/ui compatible tokens
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Meeting type badge colors
        "badge-council": "#1B3A6B",
        "badge-planning": "#0D9488",
        "badge-downtown": "#4F46E5",
        "badge-parks": "#166534",
        "badge-senior": "#7C3AED",
        "badge-economic": "#EA580C",
        "badge-legal": "#C8102E",
        "badge-safety": "#B91C1C",
        // Meeting status colors
        "status-upcoming": "#2563EB",
        "status-final": "#166534",
        "status-cancelled": "#DC2626",
        "status-draft": "#CA8A04",
        "status-amended": "#EA580C",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      maxWidth: {
        content: "1200px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            fontSize: "1rem",
            lineHeight: "1.6",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
