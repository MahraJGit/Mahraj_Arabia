import Link from "next/link";

import { ProfileHero } from "@/components/layout/profile-hero";
import { Button } from "@/components/ui/button";
import { aboutHero } from "@/content/about";

export function AboutHero() {
  return (
    <ProfileHero
      title={aboutHero.title}
      description={aboutHero.description}
      image={aboutHero.image}
      breadcrumb={[{ label: "About Us" }]}
      eyebrow="About Mahraj Arabia"
      actions={
        <>
          <Button asChild variant="brand" size="xl">
            <Link href="/contact#quote-form">Request a Quote</Link>
          </Button>
          <Button asChild variant="brandOutline" size="xl">
            <Link href="/services">Explore Our Services</Link>
          </Button>
        </>
      }
    />
  );
}
