import type { Metadata } from "next";

import { ContactHero } from "@/components/contact/contact-hero";
import { CurrentLocation } from "@/components/contact/current-location";
import { GetInTouch } from "@/components/contact/get-in-touch";
import { RegionalOffices } from "@/components/contact/regional-offices";
import { TechnicalFaqForm } from "@/components/home/technical-faq-form";
import { contactFaqs, contactFaqIntro } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call, visit or send your project brief through WhatsApp. Mahraj Arabia — Office No 9, 1st Floor, 5207, Al Malqa, Riyadh.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <GetInTouch />
      <CurrentLocation />
      <RegionalOffices />
      <TechnicalFaqForm
        formIdPrefix="contact"
        faqs={contactFaqs}
        faqIntro={contactFaqIntro}
      />
    </>
  );
}
