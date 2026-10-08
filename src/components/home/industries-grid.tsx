import Link from "next/link";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { homeIndustriesCompact } from "@/content/home";

export function IndustriesGrid() {
  return (
    <Section id="project-settings">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Project settings</Eyebrow>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Solutions across project settings
        </h2>
        <p className="mt-4 text-base leading-relaxed text-body">
          Construction, industrial, commercial and event sites—each with its own
          access, utilities and programme needs.
        </p>
      </div>

      <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {homeIndustriesCompact.map(({ slug, label, icon: Icon }) => (
          <StaggerItem key={slug}>
            <div className="flex h-full flex-col items-center justify-center gap-2 border border-border bg-background px-4 py-6 text-center">
              <Icon className="size-5 text-brand" />
              <span className="text-xs font-medium text-ink">{label}</span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10 flex justify-center">
        <Button asChild variant="brandOutline" size="xl">
          <Link href="/industries">Explore Industry Solutions</Link>
        </Button>
      </div>
    </Section>
  );
}
