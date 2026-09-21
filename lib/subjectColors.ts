// Subject accent colors — single source of truth keyed by subject slug
// (design.md §3 "Dedicated Subject Palette"). Every component pulls color
// from data via this map instead of hardcoding per-subject styles.

export const subjectColors: Record<string, string> = {
  mathematics: "#4B4FF2",
  science: "#2FB673",
  english: "#FF5A3C",
  nepali: "#F0A93C",
  "social-studies": "#E85D75",
  "optional-mathematics": "#2FB6A8",
  "computer-science": "#5B6EE8",
  "health-population-environment": "#0E9F8A",
};

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// 12% tint background for a given accent color (used for badges/icons)
export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Solid readable foreground drawn on the 12% tint fill
export function tintFill(hex: string): string {
  return withAlpha(hex, 0.12);
}