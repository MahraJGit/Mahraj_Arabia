import Link from "next/link";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { homeIndustriesCompact } from "@/content/home";

export function IndustriesGrid() {
  return (
    <Section>
      <h2 className="text-center text-3xl font-semibold sm:text-4xl">
        Industries We Serve
      </h2>

      <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {homeIndustriesCompact.map(({ slug, label, icon: Icon }) => (
          <StaggerItem key={slug}>
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-sm motion-reduce:hover:translate-y-0">
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
