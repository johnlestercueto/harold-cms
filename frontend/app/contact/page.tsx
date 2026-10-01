import { getSiteSettings } from "@/lib/payload/houses";

export const metadata = {
  title: "Contact | Burj Calapan",
  description:
    "Get in touch with Burj Calapan for stays, questions, and reservations.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const phone = settings?.contactNumber || "+63 917 123 4567";
  const email = settings?.email || "hello@calapantransienthouses.com";
  const address = settings?.address || "Calapan City, Oriental Mindoro";
  const city = settings?.city || "Calapan";
  const province = settings?.province || "Oriental Mindoro";
  const facebook = settings?.facebookUrl || "https://facebook.com";
  const messenger = settings?.messengerUrl || "https://m.me";

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          We’re here to help.
        </h1>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Reach us</h2>
          <ul className="mt-5 space-y-4 text-base text-slate-600">
            <li>
              <span className="font-medium text-slate-900">Phone:</span> {phone}
            </li>
            <li>
              <span className="font-medium text-slate-900">Email:</span> {email}
            </li>
            <li>
              <span className="font-medium text-slate-900">Address:</span>{" "}
              {address}
            </li>
            <li>
              <span className="font-medium text-slate-900">Location:</span>{" "}
              {city}, {province}
            </li>
          </ul>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Social</h2>
          <ul className="mt-5 space-y-4 text-base text-slate-600">
            <li>
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={messenger}
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900"
              >
                Messenger
              </a>
            </li>
            <li>
              Business hours:{" "}
              {settings?.openingHours || "Daily, 8:00 AM - 8:00 PM"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
