"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebaseUser } from "@/lib/firebase/client";
import { ProfileSettings } from "@/components/settings/ProfileSettings";

export function ProfileGuard() {
  const { user, loading } = useFirebaseUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

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

  if (!user) return null;

  return <ProfileSettings />;
}
