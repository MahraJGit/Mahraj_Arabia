import { ProfileClosingCta } from "@/components/layout/profile-closing-cta";
import { Section } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { aboutCta, aboutFaqIntro, aboutFaqs } from "@/content/about";

export function AboutFaq() {
  return (
    <Section>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          FAQs
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-body">{aboutFaqIntro}</p>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue={aboutFaqs[0]?.question}
        className="mt-8 max-w-3xl border-y border-border"
      >
        {aboutFaqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="py-4 text-start text-base font-medium text-ink hover:no-underline data-[state=open]:text-brand">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-relaxed text-body">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

export function AboutCta() {
  return (
    <ProfileClosingCta
      title={aboutCta.title}
      description={aboutCta.description}
    />
  );
}
