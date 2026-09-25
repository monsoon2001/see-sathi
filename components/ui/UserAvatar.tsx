"use client";

import { useEffect, useState } from "react";
import type { Gender } from "@/lib/profile";
import { cn } from "@/lib/utils";

export type { Gender };

function GenderAvatar({ gender, name }: { gender: Gender; name?: string | null }) {
  const bgId = gender === "female" ? "uav-f" : gender === "male" ? "uav-m" : "uav-o";
  const hair = gender === "female" ? "#181A2B" : gender === "male" ? "#0E1020" : "#1F2136";
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full" role="img" aria-label={`${gender} avatar for ${name ?? "student"}`}>
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          {gender === "male" ? (
            <>
              <stop offset="0" stopColor="#4B4FF2" />
              <stop offset="1" stopColor="#2F30DA" />
            </>
          ) : gender === "female" ? (
            <>
              <stop offset="0" stopColor="#FD583A" />
              <stop offset="1" stopColor="#FF8A6E" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#2FB673" />
              <stop offset="1" stopColor="#007645" />
            </>
          )}
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="48" fill={`url(#${bgId})`} />
      {gender === "female" ? <circle cx="48" cy="40" r="23" fill={hair} /> : <circle cx="48" cy="38" r="20" fill={hair} />}
      <circle cx="48" cy={gender === "female" ? 44 : 42} r={gender === "female" ? 16 : 17} fill="#F3C6A1" />
      {gender === "female" && <path d="M28 52 C30 64 38 70 48 70 C58 70 66 64 68 52 Z" fill={hair} />}
      <ellipse cx="48" cy="96" rx="31" ry="13" fill="#FFFFFF" fillOpacity="0.3" />
    </svg>
  );
}

export function GenderAvatarBox({ gender, name, className }: { gender: Gender; name?: string | null; className?: string }) {
  return (
    <span className={cn("inline-flex overflow-hidden", className)}>
      <GenderAvatar gender={gender} name={name} />
    </span>
  );
}

const INITIAL_PALETTE = [
  ["#4B4FF2", "#2F30DA"],
  ["#FD583A", "#B5250C"],
  ["#2FB673", "#007645"],
  ["#8A63D2", "#5B3FA8"],
  ["#E49A3D", "#B06E1C"],
] as const;

function initials(name?: string | null): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "S";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

function initialsColor(name?: string | null): number {
  let h = 0;
  const s = name ?? "";
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % INITIAL_PALETTE.length;
}

function InitialsAvatar({ name }: { name?: string | null }) {
  const [primary, secondary] = INITIAL_PALETTE[initialsColor(name)];
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
      <span className="font-bold text-on-primary" style={{ fontSize: "calc(100cqw * 0.36)", lineHeight: 1 }}>
        {initials(name)}
      </span>
    </div>
  );
}

export interface UserAvatarProps {
  /** Auth user photo URL (e.g. Google). Falls back gracefully if missing or broken. */
  src?: string | null;
  name?: string | null;
  /** Chosen gender — used for the fallback avatar when there is no usable photo. */
  gender?: Gender | "";
  className?: string;
}

export function UserAvatar({ src, name, gender, className }: UserAvatarProps) {
  const [usePhoto, setUsePhoto] = useState(true);

  useEffect(() => {
    setUsePhoto(true);
  }, [src]);

  const showPhoto = Boolean(src) && usePhoto;

  return (
    <div className={cn("relative overflow-hidden rounded-full bg-surface-container-high", className)} style={{ aspectRatio: "1 / 1", containerType: "inline-size" }}>
      {showPhoto ? (
        <img
          src={src as string}
          alt={name ?? "Student avatar"}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setUsePhoto(false)}
        />
      ) : gender === "male" || gender === "female" || gender === "other" ? (
        <GenderAvatar gender={gender} name={name} />
      ) : (
        <InitialsAvatar name={name} />
      )}
    </div>
  );
}