import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/layout/page-hero";
import { ProfileClosingCta } from "@/components/layout/profile-closing-cta";
import { Section } from "@/components/layout/section";
import { Media } from "@/components/media";
import { getServiceGroups } from "@/lib/public/services";

export const metadata: Metadata = {
  title: "Our Solutions",
  description:
    "Modular, portable, fencing and steel solutions for construction, industrial, commercial and event projects in Riyadh.",
};

export default async function ServicesPage() {
  const groups = await getServiceGroups();

  return (
    <>
      <PageHero
        title="A connected range of solutions."
        description="Practical, adaptable modular, portable, fencing and steel solutions for worksites, operations, businesses and events."
        image="/images/heroes/service-hero.png"
        eyebrow="Our solutions"
        fullBleed
        breadcrumb={[{ label: "Services", href: "/services" }]}
      />
      <Section>
        <div className="space-y-16">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`service-group-${group.slug}`}>
              <div className="mb-8 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  Our solutions
                </p>
                <h2
                  id={`service-group-${group.slug}`}
                  className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  {group.title}
                </h2>
                <p className="mt-3 text-sm text-body">
                  {group.children.length} solution
                  {group.children.length === 1 ? "" : "s"}
                </p>
              </div>

              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.children.map((service, index) => (
                  <StaggerItem key={service.slug} className="h-full">
                    <Link
                      href={service.href}
                      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    >
                      <Media
                        src={service.image}
                        alt={service.imageAlt}
                        className="bg-surface-alt"
                        sizes="(min-width: 1280px) 26vw, (min-width: 640px) 45vw, 90vw"
                        fit="natural"
                      />
                      <div className="flex flex-1 flex-col p-6 sm:p-7">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight">
                          {service.title}
                        </h3>
                        <p className="mt-4 flex-1 text-sm leading-relaxed text-body">
                          {service.excerpt}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-brand">
                          Explore solution
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          ))}
        </div>
      </Section>
      <ProfileClosingCta
        title="Need a solution scoped for your site?"
        description="Tell us the use, quantity and location. Mahraj Arabia will help shape a clear modular, fencing or steel proposal."
      />
    </>
  );
}
