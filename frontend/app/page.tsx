import Image from "next/image";
import Link from "next/link";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { HouseCard } from "@/components/houses/HouseCard";
import { Button } from "@/components/ui/Button";
import { getAnnouncements } from "@/lib/payload/announcements";
import { getFAQs } from "@/lib/payload/faqs";
import {
  getFeaturedTransientHouses,
  getSiteSettings,
} from "@/lib/payload/houses";

export const metadata = {
  title: "Home | Burj Calapan",
  description:
    "Find comfortable transient houses in Calapan, Oriental Mindoro.",
};

export default async function HomePage() {
  const [featuredResponse, faqsResponse, announcementsResponse, siteSettings] =
    await Promise.all([
      getFeaturedTransientHouses(),
      getFAQs(),
      getAnnouncements(),
      getSiteSettings(),
    ]);

  const featuredHouses = featuredResponse?.docs ?? [];
  const faqs = faqsResponse?.docs ?? [];
  const announcements = announcementsResponse?.docs ?? [];
  const siteName = siteSettings?.siteName || "Burj Calapan";

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-600">
              Comfortable stays in Calapan
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find your comfortable stay in Calapan.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Curated transient homes for families, couples, and travelers who
              want a simple, safe, and relaxing place to stay.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/transient-houses">Browse houses</Button>
              <Button href="/about" variant="secondary">
                Learn more
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div>
                <span className="block text-2xl font-semibold text-slate-900">
                  120+
                </span>{" "}
                guests served
              </div>
              <div>
                <span className="block text-2xl font-semibold text-slate-900">
                  4.9/5
                </span>{" "}
                guest rating
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-5">
            <div className="overflow-hidden rounded-[24px] bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                alt="Cozy transient house exterior"
                width={1200}
                height={840}
                className="h-[420px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Where are you going?
              </label>
              <input
                id="location"
                placeholder="Calapan, Oriental Mindoro"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>
            <div>
              <label
                htmlFor="checkin"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Check-in
              </label>
              <input
                id="checkin"
                type="date"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label
                htmlFor="checkout"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Check-out
              </label>
              <input
                id="checkout"
                type="date"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
              />
            </div>
            <Button
              href="/transient-houses"
              className="h-[52px] w-full lg:w-auto"
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Featured stays
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Popular transient houses
            </h2>
          </div>
          <Link
            href="/transient-houses"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            View all
          </Link>
        </div>

        {featuredHouses.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredHouses.map((house) => (
              <HouseCard key={house.id ?? house.slug} house={house} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            Featured houses will appear here once the CMS is connected.
          </div>
        )}
      </section>

      <section className="border-y border-white/70 bg-white/45 py-16 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#007aff]">
              Amenities
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Everything you need for a comfortable visit
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              "Air conditioning",
              "Private bathroom",
              "Wi-Fi",
              "Kitchenette",
              "Parking",
              "24/7 check-in",
            ].map((amenity) => (
              <div
                key={amenity}
                className="rounded-[24px] border border-white/80 bg-white/70 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#007aff]/10 text-lg text-[#007aff]">
                  ✓
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {amenity}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Why choose us
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            A smooth, comfortable stay from arrival to checkout
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              "Simple booking",
              "Straightforward check-in and clear room details for a stress-free stay.",
            ],
            [
              "Prime location",
              "Stay close to local essentials, dining, and the heart of Calapan.",
            ],
            [
              "Trusted hosting",
              "Clean spaces, responsive communication, and dependable support.",
            ],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg font-semibold text-slate-900">
                {title[0]}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Location
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Calapan area
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
                {siteName} brings guests to a practical, convenient location in
                Calapan, making it easy to enjoy local dining, essentials, and
                everyday travel.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <p>Calapan City, Oriental Mindoro</p>
                <p>Easy access to local town centers and transport routes</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-slate-100">
              <div className="h-[320px] w-full bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.1),_transparent_55%),linear-gradient(135deg,#dbeafe,#f8fafc)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Frequently asked questions
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Quick answers before you book
          </h2>
        </div>
        {faqs.length ? (
          <FAQAccordion faqs={faqs.slice(0, 5)} />
        ) : (
          <p className="text-slate-500">
            FAQ content will appear here once published in the CMS.
          </p>
        )}
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Latest updates
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Announcements
              </h2>
              <div className="mt-6 space-y-4">
                {announcements.slice(0, 3).map((announcement) => (
                  <Link
                    key={announcement.slug}
                    href={`/announcements/${announcement.slug}`}
                    className="block rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:bg-slate-100"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      {announcement.publishedDate
                        ? new Date(
                            announcement.publishedDate,
                          ).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Announcement"}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {announcement.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-[#007aff]/10 bg-[#eaf3ff]/80 p-8 text-slate-900 shadow-[0_18px_50px_rgba(0,122,255,0.08)]">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#007aff]">
                Ready to stay
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                Book a comfortable stay today
              </h3>
              <p className="mt-4 text-slate-600">
                Browse available transient houses and reserve the right fit for
                your trip.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  href="/transient-houses"
                  className="bg-[#007aff] text-white hover:bg-[#006fe6]"
                >
                  Find a stay
                </Button>
                <Button
                  href="/contact"
                  variant="secondary"
                  className="border-slate-200 bg-white/70 text-slate-700 hover:bg-white"
                >
                  Talk to us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
