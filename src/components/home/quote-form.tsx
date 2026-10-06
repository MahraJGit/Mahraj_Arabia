"use client";

import { EnquiryForm } from "@/components/forms/enquiry-form";

export function QuoteForm() {
  return (
    <div className="rounded-md bg-surface-alt p-8 lg:p-10">
      <h3 className="text-xl font-semibold sm:text-2xl">Get a Technical Quote</h3>
      <p className="mt-2 text-sm leading-relaxed text-body">
        Provide project details and our engineers will contact you within 24 hours.
      </p>
      <EnquiryForm
        idPrefix="quote"
        submitLabel="Send Quote Request"
        className="mt-7"
      />
    </div>
  );
}
