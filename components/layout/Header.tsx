"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils";
import { useFirebaseUser } from "@/lib/firebase/client";

const navItems = [
  { label: "Home", path: "/", match: "exact" },
  { label: "Subjects", path: "/subjects", match: "prefix" },
  { label: "Past Papers", path: "/past-papers", match: "prefix" },
  { label: "Mock Test", path: "/exam-simulator", match: "prefix" },
  { label: "Saved", path: "/saved", match: "prefix" },
  { label: "Search", path: "/search", match: "prefix" },
];

const navPill =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 font-title text-title transition-colors";
const navActiveClass = `${navPill} bg-primary-fixed text-on-primary-fixed`;
const navIdleClass = `${navPill} text-on-surface-variant hover:bg-surface-container hover:text-on-surface`;

function firstNameOf(name?: string | null, email?: string | null): string {
  const fromName = name?.trim().split(/\s+/)[0];
  if (fromName) return fromName;
  const fromEmail = email?.split("@")[0];
  if (fromEmail) return fromEmail.charAt(0).toUpperCase() + fromEmail.slice(1);
  return "Sathi";
}

export function Header() {
  const pathname = usePathname();
  const { user } = useFirebaseUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string, match: string) =>
    match === "exact" ? pathname === path : pathname.startsWith(path) && pathname !== "/";

  const firstName = firstNameOf(user?.displayName, user?.email);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-surface-container bg-surface-container-lowest/90 shadow-[0_1px_4px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 lg:px-8">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 rounded-full bg-surface-container-low/60 p-1 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                aria-current={isActive(item.path, item.match) ? "page" : undefined}
                className={cn(isActive(item.path, item.match) ? navActiveClass : navIdleClass)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Auth-aware right side */}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="hidden items-center gap-2 rounded-full px-2 py-1 font-title text-title text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface md:inline-flex"
                >
                  Hello, <span className="font-semibold text-on-surface">{firstName}</span>
                </Link>
                <Link href="/profile" aria-label="Your profile" className="flex items-center">
                  <UserAvatar src={user.photoURL} name={user.displayName} gender="" className="h-8 w-8" />
                </Link>
              </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-full bg-primary-container px-4 py-2 font-title text-title font-semibold text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(75,79,242,0.42)] sm:inline-flex"
              >
                Log in
              </Link>
            </>
          )}

            {/* Hamburger – visible below xl */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high xl:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-surface-container bg-surface-container-lowest/95 px-4 pb-4 pt-2 backdrop-blur-xl xl:hidden"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-label-caps uppercase tracking-wider text-outline">Menu</span>
            </div>
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    aria-current={isActive(item.path, item.match) ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block w-full rounded-2xl px-4 py-3 font-title text-title transition-colors",
                      isActive(item.path, item.match)
                        ? "bg-primary-fixed text-on-primary-fixed"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {user ? (
                <li>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-surface-container"
                  >
                    <UserAvatar src={user.photoURL} name={user.displayName} gender="" className="h-9 w-9" />
                    <span className="min-w-0">
                      <span className="block font-title text-title text-on-surface">Hello, {firstName}</span>
                      <span className="block truncate text-label-md text-on-surface-variant">{user.email}</span>
                    </span>
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full rounded-full bg-primary-container px-4 py-3 text-center font-title text-title font-semibold text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(75,79,242,0.42)]"
                  >
                    Log in
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}