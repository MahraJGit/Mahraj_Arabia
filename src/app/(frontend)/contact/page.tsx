import type { Metadata } from "next";

import { ContactHero } from "@/components/contact/contact-hero";
import { CurrentLocation } from "@/components/contact/current-location";
import { GetInTouch } from "@/components/contact/get-in-touch";
import { RegionalOffices } from "@/components/contact/regional-offices";
import { TechnicalFaqForm } from "@/components/home/technical-faq-form";
import { ProfileClosingCta } from "@/components/layout/profile-closing-cta";
import { contactFaqs, contactFaqIntro } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call or WhatsApp KSA +966 56 602 1891 or UAE +971 50 882 2414. Visit Building 5207, Street 392, Al Malqa District, Riyadh 13525, Saudi Arabia.",
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
      <ProfileClosingCta
        title="Ready to discuss your requirement?"
        description="Call, WhatsApp, or send drawings. Mahraj Arabia will help define a clear next step."
      />
    </>
  );
}
