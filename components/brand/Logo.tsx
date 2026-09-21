import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, wordmark = "official" }: { className?: string; wordmark?: "official" | "modern" }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 shrink-0", className)} aria-label="SEE Sathi — Home">
      {wordmark === "official" ? (
        <svg viewBox="0 0 320 80" className="h-[52px] w-auto object-contain" fill="none" aria-hidden="true">
          <g transform="translate(10, 14)">
            <rect x="0" y="8" width="32" height="38" rx="16" fill="#4B4FF2" />
            <circle cx="16" cy="18" r="6" fill="#FFFFFF" opacity="0.9" />
            <rect x="24" y="0" width="32" height="46" rx="16" fill="#FF5A3C" fillOpacity="0.92" />
            <circle cx="40" cy="12" r="6" fill="#FFFFFF" opacity="0.9" />
            <path d="M16 28 C 24 24, 32 24, 40 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
          <g transform="translate(80, 20)">
            <rect x="0" y="6" width="62" height="34" rx="8" fill="#0E1020" />
            <text
              x="31"
              y="30"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
              fontWeight="900"
              fontSize="20"
              fill="#FFFFFF"
              textAnchor="middle"
              letterSpacing="1"
            >
              SEE
            </text>
            <text
              x="74"
              y="32"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
              fontWeight="800"
              fontSize="30"
              fill="#0E1020"
              letterSpacing="-0.5"
            >
              Sathi
            </text>
            <circle cx="152" cy="18" r="4.5" fill="#4B4FF2" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 280 64" className="h-[48px] w-auto object-contain" fill="none" aria-hidden="true">
          <g transform="translate(4, 8)">
            <rect x="0" y="4" width="22" height="40" rx="11" fill="#4B4FF2" />
            <circle cx="11" cy="14" r="4.5" fill="#FFFFFF" />
            <rect x="18" y="0" width="22" height="48" rx="11" fill="#FF5A3C" />
            <circle cx="29" cy="11" r="4.5" fill="#FFFFFF" />
            <path d="M11 25 C17 21, 23 21, 29 25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
          <g transform="translate(56, 12)">
            <rect x="0" y="3" width="54" height="34" rx="8" fill="#0E1020" />
            <text
              x="27"
              y="27"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
              fontWeight="900"
              fontSize="18"
              fill="#FFFFFF"
              textAnchor="middle"
              letterSpacing="1"
            >
              SEE
            </text>
            <text
              x="64"
              y="29"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
              fontWeight="800"
              fontSize="28"
              fill="#0E1020"
              letterSpacing="-0.5"
            >
              Sathi
            </text>
            <circle cx="138" cy="17" r="4" fill="#4B4FF2" />
          </g>
        </svg>
      )}
    </Link>
  );
}