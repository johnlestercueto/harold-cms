import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { SiteSettings } from "@/types/payload";

export function Footer({
  siteSettings,
}: {
  siteSettings?: SiteSettings | null;
}) {
  const siteName = siteSettings?.siteName || siteConfig.name;
  const tagline = siteSettings?.tagline || siteConfig.tagline;
  const phone = siteSettings?.contactNumber || siteConfig.defaultPhone;
  const email = siteSettings?.email || siteConfig.defaultEmail;
  const address = siteSettings?.address || siteConfig.defaultAddress;
  const logoWord = siteName.split(" ")[0] || "Burj";
  const secondaryWord = siteName.includes(" ")
    ? siteName.slice(logoWord.length + 1) || "Calapan"
    : "Calapan";

  return (
    <footer className="border-t border-white/70 bg-white/45 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#007aff] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(0,122,255,0.2)]">
              {logoWord.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
                {logoWord}
              </p>
              <p className="text-xs text-slate-500">{secondaryWord}</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">{tagline}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
            Explore
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-slate-900">
                Home
              </Link>
            </li>
            <li>
              <Link href="/transient-houses" className="hover:text-slate-900">
                Houses
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-slate-900">
                About
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-slate-900">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
            Support
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>
              <Link href="/contact" className="hover:text-slate-900">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/announcements" className="hover:text-slate-900">
                Announcements
              </Link>
            </li>
            <li>
              <Link href="/booking" className="hover:text-slate-900">
                Book a stay
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>{phone}</li>
            <li>{email}</li>
            <li>{address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <p>{tagline}</p>
        </div>
      </div>
    </footer>
  );
}
