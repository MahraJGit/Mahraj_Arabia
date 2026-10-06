import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { aboutCta, aboutFaqIntro, aboutFaqs } from "@/content/about";

function hasPublicAsset(src: string) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function AboutFaq() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">FAQs</h2>
        <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
          {aboutFaqIntro}
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue={aboutFaqs[0]?.question}
        className="mx-auto mt-8 max-w-3xl"
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
  const showImage = hasPublicAsset(aboutCta.image);

  return (
    <Section spacing="compact">
      <div className="relative isolate overflow-hidden rounded-md">
        <div aria-hidden className="absolute inset-0 -z-20 bg-brand-dark" />
        {showImage ? (
          <Image
            src={aboutCta.image}
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover object-center"
          />
        ) : null}
        <div aria-hidden className="absolute inset-0 -z-10 bg-brand-dark/80" />

        <div className="flex flex-col items-center px-6 py-14 text-center sm:px-10 lg:py-16">
          <h2 className="max-w-xl font-heading text-3xl font-semibold text-white sm:text-4xl">
            {aboutCta.title}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            {aboutCta.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="inverse" size="xl">
              <Link href="/contact#quote-form">Request a Quote</Link>
            </Button>
            <Button asChild variant="inverseOutline" size="xl">
              <Link href="/contact#get-in-touch">Contact us</Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
