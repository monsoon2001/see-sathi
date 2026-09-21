"use client";

import { useEffect, useState } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, type User } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase/config";

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

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
      // (most common with Google sign-in). Refresh once so the avatar loads.
      let current = u;
      if (u && !u.photoURL) {
        try {
          await u.reload();
          current = auth.currentUser;
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