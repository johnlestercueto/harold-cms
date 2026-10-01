"use client";

import { useState } from "react";
import type { Faq } from "@/types/payload";

export function FAQAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={`${faq.question}-${index}`}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="font-medium text-slate-900">{faq.question}</span>
              <span className="text-lg text-slate-500">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">
                {faq.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
