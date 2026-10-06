import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export function ComingSoon({ note }: { note: string }) {
  return (
    <Section>
      <div className="rounded-md border border-dashed border-border bg-surface-alt p-10 text-center lg:p-16">
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-body">
          {note}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="brand" size="xl">
            <Link href="/contact#quote-form">Request a Quote</Link>
          </Button>
          <Button asChild variant="brandOutline" size="xl">
            <Link href="/services">Explore Solutions</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
