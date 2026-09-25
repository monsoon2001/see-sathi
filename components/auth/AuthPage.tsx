"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
} from "firebase/auth";
import { ArrowRight, BookOpen, Check, Circle, CircleHelp, Eye, EyeOff, Loader2, MailCheck, ShieldCheck, Star } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-label-md font-semibold text-on-surface">
      {children}
    </label>
  );
}

function parseAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/missing-password":
      return "Please enter your password.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again in a few minutes.";
    case "auth/popup-closed-by-user":
      return "";
    case "auth/account-exists-with-different-credential":
    case "auth/email-already-in-use":
      return "An account with this email already exists. Choose Sign In instead.";
    default:
      return "Something went wrong. Please try again.";
  }
}

const inputCls =
  "h-12 w-full rounded-2xl bg-surface-container-low px-4 text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:shadow-[0_0_0_3px_rgba(75,79,242,0.2),inset_0_0_0_1.5px_#4b4ff2] focus:outline-none transition-all";

export function AuthPage({ mode: initialMode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");

  function safeNext(fallback: string): string {
    const n = rawNext;
    if (n && n.startsWith("/") && !n.startsWith("//")) return n;
    return fallback;
  }

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [stage, setStage] = useState<"form" | "verify">("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function switchMode(next: "signin" | "signup") {
    setMode(next);
    setStage("form");
    setError("");
    setInfo("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        if (!cred.user.emailVerified) {
          await sendEmailVerification(cred.user);
          setPendingEmail(cred.user.email ?? email.trim());
          setInfo("Check your inbox — please verify your email before continuing.");
          setStage("verify");
          return;
        }
        router.push(safeNext("/profile"));
      } else {
        const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: fullName || undefined });
        await sendEmailVerification(cred.user);
        setPendingEmail(email.trim());
        setInfo("One last step — we sent a link to verify your email.");
        setStage("verify");
      }
    } catch (err) {
      const msg = parseAuthError(err);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      // Popup first: it does not depend on the auth-domain handoff that the
      // redirect flow uses, so it keeps working even if the app and Firebase
      // disagree about the origin. Falls back to redirect automatically.
      try {
        const cred = await signInWithPopup(auth, googleProvider);
        router.push(safeNext("/profile"));
        return;
      } catch (err) {
        const code = (err as { code?: string })?.code;
        if (code !== "auth/popup-blocked" && code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") throw err;
        const msg = parseAuthError(err);
        if (msg) setError(msg);
        await signInWithRedirect(auth, googleProvider);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[AuthPage] Google sign-in failed:", err);
      const msg = parseAuthError(err);
      if (msg) setError(msg);
      else setError((err as { code?: string })?.code ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }



  // Completes a Google sign-in that came back from the redirect flow. The
  // redirect leg navigates away to the OAuth provider and returns to this same
  // page, at which point Firebase has already signed the user in — this just
  // catches errors and forwards them to the profile.
  useEffect(() => {
    let active = true;
    getRedirectResult(auth)
      .then((result) => {
        if (active && result && result.user) {
          router.push(safeNext("/profile"));
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("[AuthPage] redirect result:", (err as { code?: string })?.code, err);
        const msg = parseAuthError(err);
        if (active && msg) setError(msg);
      });
    return () => {
      active = false;
    };
  }, []);

  async function forgotPassword() {
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo("Password reset link sent to your email.");
    } catch (err) {
      const msg = parseAuthError(err);
      if (msg) setError(msg);
    }
  }

  async function resendVerification() {
    setError("");
    setInfo("");
    try {
      if (auth.currentUser) await sendEmailVerification(auth.currentUser);
      setInfo("Verification email sent. Check your inbox.");
    } catch (err) {
      const msg = parseAuthError(err);
      if (msg) setError(msg);
    }
  }

  async function confirmVerified() {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }
      await reload(user);
      if (user.emailVerified) {
        router.push(safeNext(mode === "signin" ? "/profile" : "/subjects"));
      } else {
        setError("Email not verified yet. Open the link in your inbox, then try again.");
      }
    } catch (err) {
      const msg = parseAuthError(err);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const heading =
    mode === "signin" ? (
      <>
        Welcome back, Sathi<span className="text-primary">.</span>
      </>
    ) : (
      <>
        Create your free account<span className="text-secondary">.</span>
      </>
    );
  const subtext =
    mode === "signin"
      ? "Continue your Class 10 SEE preparation right where you left off."
      : "Get instant, permanent access to all model papers and past solutions.";

  const signupRules = [
    { label: "At least 6 characters", ok: password.length >= 6 },
    { label: "Contains an uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Includes a number or symbol", ok: /[0-9]|[^\w\s]/u.test(password) },
    { label: "Passwords match", ok: confirmPassword.length > 0 && password === confirmPassword },
  ];
  const signupValid = mode === "signup" ? signupRules.every((r) => r.ok) : true;
  const showChecklist = mode === "signup" && (password.length > 0 || confirmPassword.length > 0);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col py-2 md:py-4">
        <header className="mb-4 flex w-full items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 rounded-2xl transition-transform hover:-translate-y-0.5" aria-label="SEE Sathi — back to home">
              <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-primary-container text-on-primary shadow-sm shadow-primary/20">
                <BookOpen className="text-headline-sm" fill="currentColor" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-headline-sm tracking-tight text-on-surface">
                  SEE Sathi<span className="text-secondary">.</span>
                </span>
                <span className="text-label-caps uppercase tracking-wider text-outline">Class 10 Companion</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface-variant sm:flex">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-tertiary-container" />
              SEE Exam 2081 Ready
            </div>
            <a href="#help" className="flex items-center gap-1 text-body-sm font-semibold text-primary hover:underline">
              <CircleHelp className="text-title" aria-hidden="true" />
              <span className="hidden sm:inline">Need help?</span>
            </a>
          </div>
        </header>

        <div className="grid w-full grid-cols-1 overflow-hidden rounded-lg bg-surface-container-lowest shadow-xl lg:grid-cols-12">
          <div className="flex flex-col justify-between bg-surface-container-lowest p-4 sm:p-6 lg:col-span-6 md:p-8 xl:col-span-5">
            <div>
              <div className="mb-8 inline-flex max-w-xs w-full rounded-full bg-surface-container p-1">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-full px-4 py-2 text-body-sm font-semibold transition-all duration-200",
                    mode === "signin" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "font-medium text-on-surface-variant hover:text-on-surface",
                  )}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-full px-4 py-2 text-body-sm font-semibold transition-all duration-200",
                    mode === "signup" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "font-medium text-on-surface-variant hover:text-on-surface",
                  )}
                >
                  Create Free Account
                </button>
              </div>

              <div className="mb-8">
                <h1 className="mb-1 text-headline-lg tracking-tight text-on-surface md:text-display-hero">{stage === "verify" ? <>Check your inbox<span className="text-primary">.</span></> : heading}</h1>
                <p className="text-body-md text-on-surface-variant">
                  {stage === "verify" ? "Almost there — confirm your email to unlock your account." : subtext}
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-2xl bg-error-container/15 px-4 py-3 text-body-sm font-medium text-error">{error}</div>
              )}
              {info && (
                <div className="mb-4 rounded-2xl bg-tertiary-container/15 px-4 py-3 text-body-sm font-medium text-tertiary">{info}</div>
              )}

              {stage === "verify" ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl bg-surface-container-low p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
                      <MailCheck className="text-headline-sm" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-on-surface">We emailed a verification link to</p>
                      <p className="mt-0.5 font-semibold text-primary">{pendingEmail || "your email"}</p>
                      <p className="mt-2 text-body-sm text-on-surface-variant">
                        Click the link in the email to verify your account, then come back and press Continue. Verification emails can take a few minutes to arrive.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={confirmVerified}
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-container text-body-lg font-semibold text-on-primary transition-transform active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-70"
                    style={{ boxShadow: "0 4px 14px rgba(75, 79, 242, 0.35), 0 1px 2px rgba(75, 79, 242, 0.2)" }}
                  >
                    {loading ? <Loader2 className="text-headline-sm animate-spin" aria-hidden="true" /> : null}
                    I&apos;ve verified — Continue
                    <ArrowRight className="text-headline-sm" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={resendVerification}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-surface-container-low text-body-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
                  >
                    Resend verification email
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="mx-auto block text-body-sm font-medium text-primary hover:underline"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "signup" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <FieldLabel htmlFor="auth-first">First name</FieldLabel>
                          <input
                            id="auth-first"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Suman"
                            autoComplete="given-name"
                            required
                            className={inputCls}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <FieldLabel htmlFor="auth-last">Last name</FieldLabel>
                          <input
                            id="auth-last"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Shrestha"
                            autoComplete="family-name"
                            required
                            className={inputCls}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <FieldLabel htmlFor="auth-email">Email address</FieldLabel>
                      <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@see.np"
                        autoComplete="email"
                        required
                        className={inputCls}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                        {mode === "signin" && (
                          <button type="button" onClick={forgotPassword} className="text-body-sm font-medium text-primary hover:underline">
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <input
                          id="auth-password"
                          type={showPw ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          autoComplete={mode === "signin" ? "current-password" : "new-password"}
                          minLength={6}
                          required
                          className={cn(inputCls, "pr-12")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3 flex items-center justify-center rounded-full p-1.5 text-outline transition-colors hover:text-on-surface"
                          aria-label="Toggle password visibility"
                          tabIndex={-1}
                        >
                          {showPw ? <EyeOff className="text-headline-sm" aria-hidden="true" /> : <Eye className="text-headline-sm" aria-hidden="true" />}
                        </button>
                      </div>
                    </div>

                    {mode === "signup" && showChecklist && (
                      <div className="grid grid-cols-1 gap-1.5 rounded-2xl bg-surface-container-low p-3 sm:grid-cols-2">
                        {signupRules.map((rule) => (
                          <span
                            key={rule.label}
                            className={cn(
                              "flex items-center gap-1.5 text-body-sm transition-colors",
                              rule.ok ? "font-medium text-tertiary" : "text-on-surface-variant",
                            )}
                          >
                            {rule.ok ? (
                              <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-outline" aria-hidden="true" />
                            )}
                            {rule.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {mode === "signup" && (
                      <div className="space-y-1.5">
                        <FieldLabel htmlFor="auth-confirm-password">Confirm password</FieldLabel>
                        <div className="relative flex items-center">
                          <input
                            id="auth-confirm-password"
                            type={showConfirmPw ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••••••"
                            autoComplete="new-password"
                            minLength={6}
                            required
                            className={cn(inputCls, "pr-12")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPw((v) => !v)}
                            className="absolute right-3 flex items-center justify-center rounded-full p-1.5 text-outline transition-colors hover:text-on-surface"
                            aria-label="Toggle confirm password visibility"
                            tabIndex={-1}
                          >
                            {showConfirmPw ? <EyeOff className="text-headline-sm" aria-hidden="true" /> : <Eye className="text-headline-sm" aria-hidden="true" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex cursor-pointer select-none items-center gap-2">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="h-4 w-4 rounded bg-surface-container-low accent-primary"
                        />
                        <span className="text-body-sm font-medium text-on-surface-variant">Remember me on this device</span>
                      </label>
                      <span className="hidden items-center gap-1 rounded-full bg-tertiary-container/10 px-2 py-0.5 text-label-caps text-tertiary-container sm:inline-flex">
                        <ShieldCheck className="h-[14px] w-[14px]" aria-hidden="true" /> Sync active
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !signupValid}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-container text-body-lg font-semibold text-on-primary transition-transform active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-70"
                      style={{ boxShadow: "0 4px 14px rgba(75, 79, 242, 0.35), 0 1px 2px rgba(75, 79, 242, 0.2)" }}
                    >
                      {loading ? (
                        <Loader2 className="text-headline-sm animate-spin" aria-hidden="true" />
                      ) : mode === "signin" ? (
                        "Sign In to SEE Sathi"
                      ) : (
                        "Start Learning Free"
                      )}
                      <ArrowRight className="text-headline-sm" aria-hidden="true" />
                    </button>
                  </form>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full bg-surface-variant" style={{ height: 1 }} />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-surface-container-lowest px-4 text-label-caps uppercase tracking-wider text-outline">or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={loading}
                    className="flex h-11 w-full items-center justify-center gap-2.5 rounded-2xl bg-surface-container-low text-body-sm text-on-surface transition-colors hover:bg-surface-container disabled:opacity-70"
                  >
                    <GoogleMark /> Continue with Google
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 pt-1 text-center">
              <p className="text-body-sm text-outline">
                By continuing, you agree to SEE Sathi&apos;s{" "}
                <a href="#terms" className="text-on-surface underline hover:text-primary">
                  Terms
                </a>{" "}
                &amp;{" "}
                <a href="#code" className="text-on-surface underline hover:text-primary">
                  CDC Student Honor Code
                </a>
                .
              </p>
            </div>
          </div>

          <div
            className="relative flex flex-col justify-between overflow-hidden p-4 sm:p-6 md:p-8 lg:col-span-6 xl:col-span-7"
            style={{ backgroundColor: "#0E1020" }}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #4b4ff2 0%, transparent 70%)" }} />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #fd583a 0%, transparent 70%)" }} />
            <div className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #7cfbb1 0%, transparent 70%)" }} />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 animate-ping rounded-full bg-secondary-container" />
                <span className="text-label-caps uppercase tracking-wider text-white">Curriculum 2081 Verified</span>
              </div>
              <div className="text-label-caps uppercase tracking-widest text-white/50">Nepal • Grade 10</div>
            </div>

            <div className="relative z-10 my-8">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-lg shadow-primary/30 backdrop-blur-lg">
                <BookOpen className="text-display-hero text-primary-fixed-dim" fill="currentColor" aria-hidden="true" />
              </div>
              <h2 className="mb-2 text-headline-lg leading-tight tracking-tight text-white md:text-display-hero">
                Your Class 10 study space.
                <br />
                <span className="bg-gradient-to-r from-primary-fixed to-secondary-fixed bg-clip-text text-transparent">From Mechi to Mahakali.</span>
              </h2>
              <p className="mb-8 max-w-xl text-body-lg leading-relaxed text-white/80">
                Access 80+ chapter summaries, 1,000+ past paper solutions, and verified CDC marking schemes —{" "}
                <span className="font-semibold text-white underline decoration-secondary-container decoration-2 underline-offset-4">100% free forever</span>.
              </p>

              <div className="mb-8 flex flex-wrap gap-2.5">
                {["📱 Works offline on low data", "🎯 100% CDC Syllabus aligned"].map((b) => (
                  <div key={b} className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-label-md text-white backdrop-blur-md">
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-start gap-2">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container/30 text-sm font-bold text-white">
                    AS
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-1 text-secondary-fixed">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="text-body-sm" fill="currentColor" aria-hidden="true" />
                      ))}
                      <span className="ml-1 text-label-caps text-white/60">GPA 3.95</span>
                    </div>
                    <p className="mb-2 text-body-md italic text-white/95">
                      &ldquo;SEE Sathi&apos;s step-by-step math answers gave me the confidence to score an A+ in Compulsory Math.&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-body-sm text-white">Aayush S., Kaski</p>
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-label-caps text-primary-fixed-dim">SEE Batch 2080</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-start justify-between gap-2 pt-4 text-white/60 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-body-sm text-white/80">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-tertiary-fixed" />
                <span>
                  <strong>14,280+</strong> SEE candidates preparing right now
                </span>
              </div>
              <div className="flex items-center gap-1 text-label-caps uppercase tracking-wider text-white/50">
                <span>7 Provinces</span>
                <span>•</span>
                <span>77 Districts</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-4 flex flex-col items-center justify-between gap-2 px-4 text-body-sm text-outline sm:flex-row md:px-6">
          <div className="flex items-center gap-4">
            <span>© 2081 SEE Sathi Education Foundation.</span>
            <span className="hidden md:inline">Open access initiative for Nepalese secondary students.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#model-papers" className="transition-colors hover:text-primary">
              2081 Model Sets
            </a>
            <a href="#privacy" className="transition-colors hover:text-primary">
              Privacy
            </a>
            <a href="#cdc" className="transition-colors hover:text-primary">
              CDC Syllabus
            </a>
            <a href="#contact" className="transition-colors hover:text-primary">
              Contact Support
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}