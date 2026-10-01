import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { getFAQs } from "@/lib/payload/faqs";

export const metadata = {
  title: "FAQ | Burj Calapan",
  description: "Browse common questions about staying at Burj Calapan.",
};

export default async function FAQPage() {
  const response = await getFAQs();
  const faqs = response?.docs ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          FAQ
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Questions before you book
        </h1>
      </div>

      <div className="mt-10">
        {faqs.length ? (
          <FAQAccordion faqs={faqs} />
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-slate-500">
            FAQ entries will appear here once published in the CMS.
          </div>
        )}
      </div>
    </div>
  );
}
