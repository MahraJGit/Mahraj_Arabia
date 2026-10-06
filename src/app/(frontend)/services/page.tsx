import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { Media } from "@/components/media";
import { getServiceGroups } from "@/lib/public/services";

export const metadata: Metadata = {
  title: "Our Solutions",
  description:
    "Modular, portable and steel solutions for construction, industrial, commercial and event projects in Riyadh.",
};

export default async function ServicesPage() {
  const groups = await getServiceGroups();

  return (
    <>
      <PageHero
        title="One project partner. Eight core capabilities."
        description="Practical, adaptable solutions for worksites, operations, businesses and events."
      />
      <Section>
        <div className="space-y-14">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`service-group-${group.slug}`}>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
                <h2
                  id={`service-group-${group.slug}`}
                  className="font-heading text-2xl font-semibold text-ink"
                >
                  {group.title}
                </h2>
                <p className="text-sm text-body">
                  {group.children.length} solution
                  {group.children.length === 1 ? "" : "s"}
                </p>
              </div>

              <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.children.map((service) => (
                  <StaggerItem key={service.slug}>
                    <Link
                      href={service.href}
                      className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-background transition-all hover:border-brand/40 hover:shadow-md"
                    >
                      <Media
                        src={service.image}
                        alt={service.imageAlt}
                        className="aspect-[4/3]"
                        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      />
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-base font-semibold leading-snug">
                          {service.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-body">
                          {service.excerpt}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                          Explore Solution
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
    </>
  );
}
