"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ACCOUNT_CHANGED_EVENT,
  clearStoredUser,
  getStoredUser,
  type AccountUser,
} from "@/lib/account";
import type { SiteSettings } from "@/types/payload";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Transient Houses", href: "/transient-houses" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "My Bookings", href: "/my-bookings" },
];

export function Header({
  siteSettings,
}: {
  siteSettings?: SiteSettings | null;
}) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const siteName = siteSettings?.siteName || "Burj Calapan";
  const shortName = siteName.split(" ")[0] || "Burj";

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    syncUser();
    window.addEventListener(ACCOUNT_CHANGED_EVENT, syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener(ACCOUNT_CHANGED_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/65 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${siteName} home`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#007aff] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(0,122,255,0.24)]">
            {shortName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-slate-900 uppercase">
              {shortName}
            </p>
            <p className="text-[11px] text-slate-500">
              {siteName.includes(" ")
                ? siteName.slice(shortName.length + 1) || "Calapan"
                : "Calapan"}
            </p>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-[#007aff]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          {user ? (
            <Button variant="primary" onClick={clearStoredUser}>
              Log out
            </Button>
          ) : (
            <Button href="/login" variant="primary">
              Log in
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {user ? (
            <Button
              variant="primary"
              onClick={clearStoredUser}
              className="px-4 py-2.5"
            >
              Log out
            </Button>
          ) : (
            <Button
              href="/transient-houses"
              variant="primary"
              className="px-4 py-2.5"
            >
              Stay
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
