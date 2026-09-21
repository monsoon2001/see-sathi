export type Gender = "male" | "female" | "other";

export interface StudentProfile {
  gender?: Gender | "";
  district?: string;
  schoolName?: string;
  boardRoll?: string;
  updatedAt?: number;
}

export const PROFILE_STORAGE_KEY = "see-sathi-student-profile";

export function loadProfile(): StudentProfile {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StudentProfile;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ ...profile, updatedAt: Date.now() }));
  } catch {
    /* storage unavailable */
  }
}