import Link from "next/link";
import { getAnnouncements } from "@/lib/payload/announcements";

export const metadata = {
  title: "Announcements | Burj Calapan",
  description: "Stay informed with the latest updates from Burj Calapan.",
};

export default async function AnnouncementsPage() {
  const response = await getAnnouncements();
  const announcements = response?.docs ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Announcements
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Latest updates
        </h1>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {announcements.length ? (
          announcements.map((announcement) => (
            <Link
              key={announcement.slug}
              href={`/announcements/${announcement.slug}`}
              className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1"
            >
              <div className="mb-4 overflow-hidden rounded-[20px] bg-slate-100">
                <div className="h-40 w-full bg-gradient-to-br from-slate-200 to-slate-100" />
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                {announcement.publishedDate
                  ? new Date(announcement.publishedDate).toLocaleDateString(
                      "en-PH",
                      { month: "short", day: "numeric", year: "numeric" },
                    )
                  : "Announcement"}
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                {announcement.title}
              </h2>
            </Link>
          ))
        ) : (
          <div className="md:col-span-2 xl:col-span-3 rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-slate-500">
            No announcements have been published yet.
          </div>
        )}
      </div>
    </div>
  );
}
