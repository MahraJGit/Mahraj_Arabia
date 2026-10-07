import Link from "next/link";

import { CatalogueSearchForm } from "@/components/catalogues/catalogue-search-form";
import { ProfileHero } from "@/components/layout/profile-hero";
import { Button } from "@/components/ui/button";
import { cataloguePage } from "@/content/catalogues";

export function CatalogueHero({ query }: { query?: string }) {
  return (
    <ProfileHero
      title={cataloguePage.hero.title}
      description={cataloguePage.hero.description}
      image={cataloguePage.hero.image}
      breadcrumb={[{ label: cataloguePage.hero.breadcrumb }]}
      eyebrow="Catalogues"
      actions={
        <>
          <Button asChild variant="brand" size="xl">
            <Link href="#collections">View Catalogues</Link>
          </Button>
          <Button asChild variant="brandOutline" size="xl">
            <Link href="/contact#get-in-touch">Get a Consultation</Link>
          </Button>
        </>
      }
      footer={<CatalogueSearchForm query={query} />}
    />
  );
}
