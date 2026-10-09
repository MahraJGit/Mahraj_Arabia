import { ProfileHero } from "@/components/layout/profile-hero";
import { contactHero } from "@/content/contact";

export function ContactHero() {
  return (
    <ProfileHero
      title={contactHero.title}
      description="Call, visit, or send your modular, fencing or steel project brief through WhatsApp."
      image={contactHero.image}
      breadcrumb={[{ label: "Contact Us" }]}
      eyebrow="Contact"
      fullBleed
    />
  );
}
