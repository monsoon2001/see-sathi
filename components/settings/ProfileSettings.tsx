"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  BookMarked,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Flag,
  Gauge,
  History,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  Monitor,
  Moon,
  Palette,
  School,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth, useFirebaseUser } from "@/lib/firebase/client";
import { loadProfile, saveProfile, type Gender, type StudentProfile } from "@/lib/profile";
import { allDistricts, NEPAL_PROVINCES, DISTRICT_COUNT } from "@/lib/nepalDistricts";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { getStoredTheme, setTheme, type Theme } from "@/lib/theme";
import { signOut, updateProfile } from "firebase/auth";

const inputCls =
  "w-full h-12 px-4 rounded-DEFAULT bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm placeholder:text-outline disabled:cursor-not-allowed disabled:text-on-surface-variant disabled:opacity-70";

function SettingHeader({ icon: Icon, title, sub }: { icon: typeof BadgeCheck; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-surface-container-high text-primary">
        <Icon className="text-[20px]" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-title text-title text-on-surface">{title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{sub}</p>
      </div>
    </div>
  );
}

const GENDER_OPTIONS: { value: Gender | ""; label: string }[] = [
  { value: "", label: "Select gender…" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

function provinceOfDistrict(district: string): string | undefined {
  return (Object.entries(NEPAL_PROVINCES).find(([, districts]) => districts.includes(district))?.[0] as string | undefined) || undefined;
}

export function ProfileSettings() {
  const { user, loading } = useFirebaseUser();

  // ── Appearance (functional dark mode) ─────────────────────────────
  const [theme, setThemeState] = useState<Theme>("system");
  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  function pickTheme(t: Theme) {
    setThemeState(t);
    setTheme(t);
  }

  // ── Dossier state ─────────────────────────────────────────────────
  const persisted = useMemo(() => loadProfile(), []);
  const [name, setName] = useState("");
  const [schoolName, setSchoolName] = useState(persisted.schoolName ?? "");
  const [boardRoll, setBoardRoll] = useState(persisted.boardRoll ?? "");
  const [district, setDistrict] = useState(persisted.district ?? "");
  const [gender, setGender] = useState<Gender | "">(persisted.gender ?? "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (user) setName(user.displayName ?? "");
  }, [user]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  const displayName = name.trim() || user?.displayName || "SEE Student";
  const email = user?.email ?? "";
  const genderType: Gender | "" = gender;

  // ── Logout ────────────────────────────────────────────────────────
  const [showLogout, setShowLogout] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function confirmLogout() {
    setSigningOut(true);
    try {
    await signOut(auth);
    } catch {
      /* sign out anyway locally */
    }
    window.location.href = "/";
  }

  // ── Save ──────────────────────────────────────────────────────────
  const baseline = useMemo(
    () => ({
      name: user?.displayName ?? "",
      schoolName: persisted.schoolName ?? "",
      boardRoll: persisted.boardRoll ?? "",
      district: persisted.district ?? "",
      gender: persisted.gender ?? "",
    }),
    [user, persisted],
  );

  const dirty =
    name.trim() !== baseline.name ||
    schoolName.trim() !== baseline.schoolName ||
    boardRoll.trim() !== baseline.boardRoll ||
    district !== baseline.district ||
    (gender ?? "") !== baseline.gender;

  async function handleSave() {
    setSaveError("");
    setSaving(true);
    try {
      const profile: StudentProfile = {
        schoolName: schoolName.trim(),
        boardRoll: boardRoll.trim(),
        district,
        gender: gender || "",
      };
      saveProfile(profile);
      if (user) {
        const nextName = name.trim();
        if (nextName && nextName !== (user.displayName ?? "")) {
          await updateProfile(user, { displayName: nextName });
        } else if (nextName !== (user.displayName ?? "")) {
          await updateProfile(user, { displayName: null });
        }
      }
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const locationLine = district ? `${district}${provinceOfDistrict(district) ? ` · ${provinceOfDistrict(district)} Province` : ""}` : "District not set yet — choose below";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-fixed border-t-primary" />
          <p className="font-body-md text-body-md text-on-surface-variant">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-6 pt-8 lg:pt-10 md:flex-row md:items-end justify-between md:pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2.5 py-1 text-on-primary-fixed">
            <School className="text-[15px]" aria-hidden="true" />
            <span className="font-label-caps text-label-caps">Academic Identity Hub</span>
          </div>
          <h1 className="font-display-hero text-display-hero tracking-tight text-on-surface">Student Profile &amp; Preferences</h1>
          <p className="max-w-xl font-body-md text-body-md text-on-surface-variant">
            Manage your SEE 2082/2083 candidacy profile, tactile typography scales, and offline revision bundles.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-surface-container-lowest px-4 py-2 shadow-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-tertiary" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Cloud Backup Sync: <strong className="font-title text-on-surface">Active (Pokhara Node)</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-span-4">
          <div className="relative flex flex-col items-center overflow-hidden rounded-lg bg-surface-container-lowest p-6 text-center shadow-sm">
            <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-primary-fixed-dim/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-secondary-fixed-dim/30 blur-3xl" />

            <div className="relative mb-4 mt-1">
              <div className="rounded-full bg-gradient-to-tr from-primary via-primary-container to-secondary-container p-1" style={{ boxShadow: "0 4px 14px rgba(75,79,242,0.28)" }}>
                <UserAvatar src={user?.photoURL} name={displayName} gender={genderType} className="h-28 w-28 lg:h-32 lg:w-32 rounded-full" />
              </div>
            </div>

            <h2 className="mt-1 font-headline-lg text-headline-lg tracking-tight text-on-surface">{displayName}</h2>
            <div className="mb-2 mt-1 flex flex-wrap items-center justify-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-primary-container px-2.5 py-0.5 font-label-caps text-label-caps text-on-primary" style={{ boxShadow: "0 2px 8px rgba(75,79,242,0.25)" }}>
                Class 10 Candidate
              </span>
              <span className="inline-flex items-center rounded-full bg-surface-container font-label-caps text-label-caps text-on-surface-variant">SEE 2082 / 2083 Batch</span>
            </div>
            <p className="flex max-w-xs items-center justify-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <MapPin className="text-[16px] text-outline" aria-hidden="true" />
              {locationLine}
            </p>

            <div className="mt-6 grid w-full grid-cols-2 gap-1.5 text-left">
              <div className="flex flex-col justify-between rounded-DEFAULT bg-surface-container-low p-2">
                <div className="mb-1 flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-caps text-label-caps uppercase">Subjects</span>
                  <BookOpen className="text-[16px] text-primary" aria-hidden="true" />
                </div>
                <span className="font-headline-md text-headline-md leading-none text-on-surface">07</span>
                <span className="mt-1 text-[11px] font-body-sm text-body-sm text-outline">Full CDC Syllabus</span>
              </div>
              <div className="flex flex-col justify-between rounded-DEFAULT bg-surface-container-low p-2">
                <div className="mb-1 flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-caps text-label-caps uppercase">Saved</span>
                  <BookMarked className="text-[16px] text-primary" aria-hidden="true" />
                </div>
                <span className="font-headline-md text-headline-md leading-none text-on-surface">08</span>
                <span className="mt-1 text-[11px] font-body-sm text-body-sm text-outline">Key Formulas/Notes</span>
              </div>
              <div className="flex flex-col justify-between rounded-DEFAULT bg-tertiary-fixed/40 p-2 sm:col-span-2">
                <div className="mb-1 flex items-center justify-between text-tertiary">
                  <span className="font-label-caps text-label-caps uppercase">Readiness</span>
                  <Gauge className="text-[16px] text-tertiary" aria-hidden="true" />
                </div>
                <span className="font-headline-md text-headline-md leading-none text-tertiary">42%</span>
                <span className="mt-1 text-[11px] font-body-sm text-body-sm text-on-tertiary-fixed-variant">Projected Grade: A+</span>
              </div>
            </div>

            <div className="mt-2 w-full rounded-DEFAULT bg-surface-container p-2">
              <div className="mb-1.5 flex items-center justify-between text-body-sm">
                <span className="flex items-center gap-1 text-[13px] font-title text-on-surface">
                  <Flag className="text-[16px] text-primary" aria-hidden="true" /> Board Target
                </span>
                <span className="font-title text-[13px] text-primary">GPA 4.0</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                <div className="h-full rounded-full bg-primary" style={{ width: "82%" }} />
              </div>
            </div>

            <div className="-mx-6 mt-4 w-[calc(100%+3rem)] space-y-1 rounded-b-lg bg-surface-container-low/50 px-6 pb-2 pt-4">
              <Link href="/saved" className="group flex items-center justify-between rounded-DEFAULT bg-surface-container-lowest p-2 transition-colors hover:bg-primary-fixed/40">
                <span className="flex items-center gap-2 font-title text-title text-on-surface">
                  <BookMarked className="text-[20px] text-primary" aria-hidden="true" /> Saved Notes Vault
                </span>
                <ChevronRight className="text-[18px] text-outline transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link href="/subjects" className="group flex items-center justify-between rounded-DEFAULT bg-surface-container-lowest p-2 transition-colors hover:bg-primary-fixed/40">
                <span className="flex items-center gap-2 font-title text-title text-on-surface">
                  <History className="text-[20px] text-primary" aria-hidden="true" /> Recently Studied
                </span>
                <ChevronRight className="text-[18px] text-outline transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          <div className="flex items-center justify-between rounded-DEFAULT bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                <SlidersHorizontal className="text-[24px]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md tracking-tight text-on-surface">Settings &amp; Preferences</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Customise your ergonomic reading canvas and academic data.</p>
              </div>
            </div>
            <span className="hidden rounded-full bg-surface-container px-2 py-1 font-label-caps text-label-caps uppercase text-on-surface-variant sm:inline-flex">
              {saved ? "Saved" : "Auto-Save"}
            </span>
          </div>

          <div className="space-y-4 rounded-lg bg-surface-container-lowest p-6 shadow-sm">
            <SettingHeader icon={BadgeCheck} title="Account & School Dossier" sub="Your verified candidate credentials match National Examination Board (NEB/SEE) records." />
            {saved && (
              <div className="flex items-center gap-2 rounded-2xl bg-success-soft/30 px-4 py-2.5 font-body-sm font-medium text-tertiary">
                <Check className="text-[18px]" aria-hidden="true" />
                Profile saved — changes are synced to this account.
              </div>
            )}
            {saveError && (
              <div className="rounded-2xl bg-error-container/20 px-4 py-2.5 font-body-sm font-medium text-error">Could not save: {saveError}</div>
            )}
            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="student-name" className="font-label-caps text-label-caps uppercase text-on-surface-variant">Full Legal Name</label>
                <input id="student-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Suman Shrestha" autoComplete="name" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label htmlFor="email-address" className="font-label-caps text-label-caps uppercase text-on-surface-variant">Email Address</label>
                <div className="relative">
                  <input id="email-address" type="email" value={email} readOnly disabled placeholder="your@email.com" autoComplete="email" className={inputCls} />
                  <Lock className="absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-outline" aria-label="Email is not editable" aria-hidden="true" />
                </div>
                <p className="flex items-center gap-1 text-[11px] font-body-sm text-outline">
                  <Lock className="h-3 w-3" aria-hidden="true" /> Email is your login ID and cannot be changed here.
                </p>
              </div>
              <div className="space-y-1">
                <label htmlFor="school-name" className="font-label-caps text-label-caps uppercase text-on-surface-variant">School Name (Official)</label>
                <input id="school-name" type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="e.g. Shree Shanti Vidya Mandir" autoComplete="organization" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label htmlFor="board-roll" className="flex items-center justify-between font-label-caps text-label-caps uppercase text-on-surface-variant">
                  <span>SEE Symbol / Board Roll No.</span>
                  <span className="font-normal lowercase text-outline">(optional)</span>
                </label>
                <input id="board-roll" type="text" value={boardRoll} onChange={(e) => setBoardRoll(e.target.value)} placeholder="e.g. 0241892 K" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label htmlFor="district-select" className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                  Exam Examination District
                </label>
                <select
                  id="district-select"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={cn(inputCls, "cursor-pointer", !district && "text-outline")}
                >
                  <option value="">Select your district…</option>
                  {Object.entries(NEPAL_PROVINCES).map(([province, districts]) => (
                    <optgroup key={province} label={`${province} Province`}>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d} · {province}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-[11px] font-body-sm text-outline">All {DISTRICT_COUNT} districts of Nepal are listed.</p>
              </div>
              <div className="space-y-1">
                <label htmlFor="gender-select" className="font-label-caps text-label-caps uppercase text-on-surface-variant">Gender</label>
                <select id="gender-select" value={gender} onChange={(e) => setGender(e.target.value as Gender | "")} className={cn(inputCls, "cursor-pointer", !gender && "text-outline")}>
                  {GENDER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] font-body-sm text-outline">Your avatar adapts to your choice when no photo is set.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={!dirty || saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-2.5 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" /> : <Check className="h-[18px] w-[18px]" aria-hidden="true" />}
                Save Changes
              </button>
              {dirty && !saving && (
                <p className="text-[12px] font-body-sm text-on-surface-variant">
                  You have unsaved changes. Only your name, school, symbol number, district &amp; gender are stored.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-surface-container-lowest p-6 shadow-sm">
            <SettingHeader icon={Palette} title="Appearance & Screen Mode" sub="Switch visual schemes calibrated for daylight study desks or evening lamp reading." />
            <div className="space-y-4">
              <div>
                <span className="mb-1 block font-label-caps text-label-caps uppercase text-on-surface-variant">Canvas Theme</span>
                <div className="grid grid-cols-3 gap-1 rounded-full bg-surface-container-low p-1.5">
                  {(
                    [
                      { key: "light", label: "Light", icon: Sun },
                      { key: "dark", label: "Dark", icon: Moon },
                      { key: "system", label: "System", icon: Monitor },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => pickTheme(t.key)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-full px-2 py-2 text-[13px] font-title transition-all",
                        theme === t.key ? "bg-primary-container text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface",
                      )}
                    >
                      <t.icon className="text-[16px]" aria-hidden="true" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-surface-container-lowest p-6 shadow-sm">
            <SettingHeader icon={CircleHelp} title="Help & Official CDC Guidelines" sub="Reference examination protocols, syllabus updates, and peer teacher assistance." />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <a href="#grading" className="group flex h-32 flex-col justify-between rounded-DEFAULT bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest text-primary transition-transform group-hover:scale-105">
                  <BadgeCheck className="text-[18px]" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-[14px] font-title text-on-surface">SEE Grading System Guide 2081</h4>
                  <p className="mt-0.5 text-[12px] font-body-sm text-body-sm text-on-surface-variant">35% Minimum passing mark criteria.</p>
                </div>
              </a>
              <a href="#report" className="group flex h-32 flex-col justify-between rounded-DEFAULT bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest text-secondary transition-transform group-hover:scale-105">
                  <Flag className="text-[18px]" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-[14px] font-title text-on-surface">Report Question Error</h4>
                  <p className="mt-0.5 text-[12px] font-body-sm text-body-sm text-on-surface-variant">Flag discrepancies in answer keys.</p>
                </div>
              </a>
              <div className="flex h-32 flex-col justify-between rounded-DEFAULT bg-surface-container-low p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest text-tertiary">
                  <UserRound className="text-[18px]" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-[14px] font-title text-on-surface">Student Profile</h4>
                  <p className="mt-0.5 text-[12px] font-body-sm text-body-sm text-on-surface-variant">Updated just now on this device.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pb-6 pt-4 sm:flex-row">
            <div className="text-center text-body-sm text-on-surface-variant sm:text-left">
              <span className="flex items-center justify-center gap-1.5 sm:justify-start">
                <ShieldCheck className="h-4 w-4 text-tertiary" aria-hidden="true" />
                Signed in as <strong className="text-on-surface">{email || "your account"}</strong>
              </span>
              <span className="block text-[12px] text-outline">Last active on this device: Today, 3:42 PM (Pokhara)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowLogout(true)}
              className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-5 py-2 text-secondary shadow-sm transition-all hover:bg-secondary-container hover:text-on-secondary"
            >
              <LogOut className="text-[18px]" aria-hidden="true" />
              <span className="font-title text-title">Log Out of SEE Sathi</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Logout confirmation dialog ───────────────────────────── */}
      {showLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => !signingOut && setShowLogout(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-surface-container-lowest p-6 shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-secondary-fixed-dim/50 blur-2xl" />
            <button
              type="button"
              aria-label="Close"
              onClick={() => !signingOut && setShowLogout(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            >
              <X className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>

            <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-fixed text-secondary shadow-sm">
              <LogOut className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 id="logout-title" className="font-headline-md text-headline-md tracking-tight text-on-surface">Log out of SEE Sathi?</h3>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Your progress, saved notes, and profile stay safe on this account. You can sign back in anytime to continue right where you left off.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                disabled={signingOut}
                className="inline-flex items-center justify-center rounded-full bg-surface-container px-6 py-2.5 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-60"
              >
                Stay signed in
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={signingOut}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-2.5 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(253,88,58,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(253,88,58,0.42)] disabled:opacity-60"
              >
                {signingOut ? <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" /> : <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />}
                {signingOut ? "Signing out…" : "Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}