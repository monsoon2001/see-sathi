import type { Metadata } from "next";
import { ProfileGuard } from "@/components/settings/ProfileGuard";

export const metadata: Metadata = { title: "Your Profile — SEE Sathi" };

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <ProfileGuard />
    </div>
  );
}