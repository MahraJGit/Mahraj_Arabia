import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <>
      <PageHero
        title="Careers"
        description="We are always interested in hearing from fabricators, site coordinators, and estimators for modular and steel projects."
      />
      <ComingSoon note="Open positions will be listed here. In the meantime, send your CV to our team." />
    </>
  );
}
