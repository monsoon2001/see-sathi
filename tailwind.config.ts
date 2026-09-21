import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core canvas & structure (design.md §3 + Stitch exports).
        // Token values are RGB triplets defined as CSS variables in globals.css
        // so the entire design system flips cleanly to dark mode via `.dark`.
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "paper-warm": "rgb(var(--paper-warm) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",

        // Brand accents (Material-token names match Stitch exports exactly)
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--primary-dark) / <alpha-value>)",
        "primary-fixed": "rgb(var(--primary-fixed) / <alpha-value>)",
        "primary-fixed-dim": "rgb(var(--primary-fixed-dim) / <alpha-value>)",
        "primary-container": "rgb(var(--primary-container) / <alpha-value>)",
        "on-primary": "rgb(var(--on-primary) / <alpha-value>)",
        "on-primary-fixed": "rgb(var(--on-primary-fixed) / <alpha-value>)",
        "on-primary-fixed-variant": "rgb(var(--on-primary-fixed-variant) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-dark": "rgb(var(--secondary-dark) / <alpha-value>)",
        "secondary-fixed": "rgb(var(--secondary-fixed) / <alpha-value>)",
        "secondary-fixed-dim": "rgb(var(--secondary-fixed-dim) / <alpha-value>)",
        "secondary-container": "rgb(var(--secondary-container) / <alpha-value>)",
        "on-secondary": "rgb(var(--on-secondary) / <alpha-value>)",
        "on-secondary-container": "rgb(var(--on-secondary-container) / <alpha-value>)",
        "on-secondary-fixed": "rgb(var(--on-secondary-fixed) / <alpha-value>)",
        "on-secondary-fixed-variant": "rgb(var(--on-secondary-fixed-variant) / <alpha-value>)",
        tertiary: "rgb(var(--tertiary) / <alpha-value>)",
        "tertiary-fixed": "rgb(var(--tertiary-fixed) / <alpha-value>)",
        "tertiary-fixed-dim": "rgb(var(--tertiary-fixed-dim) / <alpha-value>)",
        "tertiary-container": "rgb(var(--tertiary-container) / <alpha-value>)",
        "on-tertiary": "rgb(var(--on-tertiary) / <alpha-value>)",
        "on-tertiary-fixed": "rgb(var(--on-tertiary-fixed) / <alpha-value>)",
        "on-tertiary-fixed-variant": "rgb(var(--on-tertiary-fixed-variant) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        "success-dark": "rgb(var(--success-dark) / <alpha-value>)",
        "success-soft": "rgb(var(--success-soft) / <alpha-value>)",
        "success-medium": "rgb(var(--success-medium) / <alpha-value>)",

        error: "rgb(var(--error) / <alpha-value>)",
        "error-container": "rgb(var(--error-container) / <alpha-value>)",
        "on-error-container": "rgb(var(--on-error-container) / <alpha-value>)",

        // Neutral surfaces (Material-style tones from Stitch exports)
        background: "rgb(var(--background) / <alpha-value>)",
        "on-surface": "rgb(var(--on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--on-surface-variant) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "rgb(var(--surface-container-low) / <alpha-value>)",
        "surface-container": "rgb(var(--surface-container) / <alpha-value>)",
        "surface-container-high": "rgb(var(--surface-container-high) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--surface-container-highest) / <alpha-value>)",
        "surface-variant": "rgb(var(--surface-variant) / <alpha-value>)",
        "inverse-surface": "rgb(var(--inverse-surface) / <alpha-value>)",
        "inverse-on-surface": "rgb(var(--inverse-on-surface) / <alpha-value>)",
        outline: "rgb(var(--outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--outline-variant) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        devanagari: ["var(--font-noto-devanagari)", "var(--font-inter)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        hero: ["64px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
        "hero-mobile": ["34px", { lineHeight: "1.12", letterSpacing: "-0.025em", fontWeight: "800" }],
        h1: ["48px", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "800" }],
        h2: ["32px", { lineHeight: "1.2", letterSpacing: "-0.025em", fontWeight: "700" }],
        h3: ["22px", { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" }],
        body: ["17px", { lineHeight: "1.7" }],
        small: ["14px", { lineHeight: "1.5" }],
        eyebrow: ["12px", { lineHeight: "1.4", letterSpacing: "0.06em" }],

        // Stitch token names (used directly in the exports)
        "display-hero": ["48px", { lineHeight: "52px", letterSpacing: "-0.03em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "38px", letterSpacing: "-0.025em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "30px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-sm": ["20px", { lineHeight: "26px", letterSpacing: "-0.015em", fontWeight: "600" }],
        title: ["16px", { lineHeight: "22px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "26px", letterSpacing: "-0.005em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
        "label-caps": ["11px", { lineHeight: "14px", letterSpacing: "0.06em", fontWeight: "700" }],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        card: "16px",
      },
      boxShadow: {
        soft: "0 4px 16px rgba(14,16,32,0.06)",
        "glow-primary": "0 8px 24px rgba(75,79,242,0.18)",
        "glow-primary-lg": "0 4px 14px rgba(75,79,242,0.28), 0 1px 2px rgba(75,79,242,0.16)",
        "glow-coral": "0 4px 14px rgba(255,90,60,0.28), 0 1px 2px rgba(255,90,60,0.16)",
        "glow-success": "0 4px 14px rgba(47,182,115,0.25)",
        surface: "0 2px 4px rgba(14,16,32,0.03), 0 12px 32px rgba(14,16,32,0.04)",
        "surface-lg": "0 2px 4px rgba(14,16,32,0.03), 0 20px 48px rgba(14,16,32,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;