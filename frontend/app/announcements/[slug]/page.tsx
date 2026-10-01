import { notFound } from "next/navigation";
import { getAnnouncementBySlug } from "@/lib/payload/announcements";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const announcement = await getAnnouncementBySlug(resolved.slug);

  return {
    title: announcement
      ? `${announcement.title} | Burj Calapan`
      : "Announcement | Burj Calapan",
    description: announcement ? announcement.title : "Announcement details.",
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const announcement = await getAnnouncementBySlug(resolved.slug);

  if (!announcement) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          {announcement.publishedDate
            ? new Date(announcement.publishedDate).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Announcement"}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
          {announcement.title}
        </h1>
        <div className="mt-8 prose max-w-none text-slate-700">
          <p>
            Announcement content will be rendered here from the Payload rich
            text field once connected.
          </p>
        </div>
      </article>
    </div>
  );
}
