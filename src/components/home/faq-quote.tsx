import { QuoteForm } from "@/components/home/quote-form";
import { Section } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/content/home";

export function FaqQuote() {
  return (
    <Section>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-background p-8 lg:p-10">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Frequently Asked Technical Questions
          </h2>

          <Accordion type="single" collapsible defaultValue={faqs[0].question} className="mt-7">
            {faqs.map((faq) => (
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
        </div>

        <QuoteForm />
      </div>
    </Section>
  );
}
