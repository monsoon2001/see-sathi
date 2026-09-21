export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "see-sathi-theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const v = window.localStorage.getItem(THEME_STORAGE_KEY);
  return v === "light" || v === "dark" || v === "system" ? v : "system";
}

export function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? (systemPrefersDark() ? "dark" : "light") : theme;
}

/**
 * Applies the theme preference. Dark mode is scoped to study screens only
 * (notes, solved questions, past-paper solutions) — the app chrome stays light.
 * The reader components apply the `dark` class to their own wrapper subtree.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  void resolveTheme(theme);
  const rootEl = document.documentElement;
  rootEl.classList.remove("dark");
  rootEl.style.colorScheme = "light";
}

/** Persists the choice and applies it immediately. */
export function setTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable */
  }
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent("see-sathi-theme-change", { detail: theme }));
}

/** Reads the stored preference and applies it (used on boot). */
export function initTheme(): void {
  applyTheme(getStoredTheme());
}