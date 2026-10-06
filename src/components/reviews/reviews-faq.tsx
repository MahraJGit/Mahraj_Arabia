import { Section } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { reviewsFaqIntro, reviewsFaqs } from "@/content/reviews";

export function ReviewsFaq() {
  return (
    <Section tone="alt" spacing="none" className="pb-16 md:pb-20 lg:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">FAQs</h2>
        <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
          {reviewsFaqIntro}
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue={reviewsFaqs[0]?.question}
        className="mx-auto mt-8 max-w-3xl"
      >
        {reviewsFaqs.map((faq) => (
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
