import Link from "next/link";

import { ProfileHero } from "@/components/layout/profile-hero";
import { Button } from "@/components/ui/button";
import type { ServiceDetailView } from "@/lib/public/services";

export function ServiceHero({ service }: { service: ServiceDetailView }) {
  const breadcrumb = [
    { label: "Services", href: "/services" },
    ...(service.parentTitle
      ? [{ label: service.parentTitle, href: "/services" }]
      : []),
    { label: service.title },
  ];

  return (
    <ProfileHero
      title={service.heroTitle}
      description={service.heroDescription}
      image={service.image}
      breadcrumb={breadcrumb}
      eyebrow={service.title}
      actions={
        <Button asChild variant="brand" size="xl">
          <Link href="/contact#quote-form">Request a Quote</Link>
        </Button>
      }
    />
  );
}
