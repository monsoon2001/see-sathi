"use client";

import { useEffect, useState } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, updateProfile, type User } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase/config";

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string),
    isTokenAutoRefreshEnabled: true,
  });
}

if (typeof window !== "undefined") {
  import("firebase/analytics")
    .then(({ getAnalytics, isSupported }) => isSupported().then((ok) => ok && getAnalytics(app)).catch(() => undefined))
    .catch(() => undefined);
}

export function useFirebaseUser(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const unsub = onAuthStateChanged(auth, async (u) => {
      // On a restored session the cached profile can arrive without a photoURL
      // (most common with Google sign-in). Refresh once so the avatar loads,
      // and fall back to the photo stored on the provider profile if the top
      // level user still has none.
      let current = u;
      if (u && !u.photoURL) {
        try {
          await u.reload();
          current = auth.currentUser;
          const providerPhoto = current?.providerData.find((p) => p?.photoURL)?.photoURL;
          if (current && !current.photoURL && providerPhoto) {
            await updateProfile(current, { photoURL: providerPhoto }).catch(() => undefined);
          }
        } catch {
          /* session may be expired — keep the cached user */
        }
      }
      if (active) {
        setUser(current);
        setLoading(false);
      }
    });
    return () => {
      active = false;
      unsub();
    };
  }, []);

  return { user, loading };
}