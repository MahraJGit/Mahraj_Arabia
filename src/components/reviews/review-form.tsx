"use client";

import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { feedbackFormIntro } from "@/content/reviews";

export function ReviewForm() {
  return (
    <Section tone="alt">
      <SectionHeading
        align="center"
        title={feedbackFormIntro.title}
        description={feedbackFormIntro.description}
      />

      <div className="mx-auto mt-10 max-w-3xl rounded-md bg-background p-8 shadow-sm ring-1 ring-border lg:p-10">
        <h3 className="text-xl font-semibold uppercase tracking-[0.04em] sm:text-2xl">
          Technical Expertise
        </h3>
        <EnquiryForm idPrefix="review" className="mt-6" />
      </div>
    </Section>
  );
}
