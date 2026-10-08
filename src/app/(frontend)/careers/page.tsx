import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHero } from "@/components/layout/page-hero";
import { ProfileClosingCta } from "@/components/layout/profile-closing-cta";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <>
      <PageHero
        title="Build with Mahraj Arabia."
        description="We are always interested in hearing from fabricators, site coordinators, and estimators for modular, fencing and steel projects."
        image="/images/profile/steel-fabrication-workshop.jpg"
        eyebrow="Careers"
        breadcrumb={[{ label: "Careers", href: "/careers" }]}
      />
      <ComingSoon note="Open positions will be listed here. In the meantime, send your CV to our team." />
      <ProfileClosingCta
        title="Want to join the team?"
        description="Send your CV and a short note about the role you are interested in."
        primaryHref="/contact"
        primaryLabel="Contact us"
      />
    </>
  );
}
