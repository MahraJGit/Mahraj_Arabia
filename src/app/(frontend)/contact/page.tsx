import type { Metadata } from "next";

import { ContactHero } from "@/components/contact/contact-hero";
import { GetInTouch } from "@/components/contact/get-in-touch";
import { RegionalOffices } from "@/components/contact/regional-offices";
import { TechnicalFaqForm } from "@/components/home/technical-faq-form";
import { ProfileClosingCta } from "@/components/layout/profile-closing-cta";
import { contactFaqs, contactFaqIntro } from "@/content/contact";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    `Call or WhatsApp KSA +966 56 602 1891 or UAE +971 50 882 2414. Visit ${site.address.line1}, ${site.address.line2}, ${site.address.line3}.`,
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <GetInTouch />
      <RegionalOffices />
      <TechnicalFaqForm
        formIdPrefix="contact"
        faqs={contactFaqs}
        faqIntro={contactFaqIntro}
      />
      <ProfileClosingCta
        title="Ready to discuss your requirement?"
        description="Call, WhatsApp, or send drawings. Mahraj Arabia will help define a clear next step."
      />
    </>
  );
}
