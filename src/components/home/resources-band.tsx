import Link from "next/link";
import { FileText } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export function ResourcesBand() {
  return (
    <Section tone="brand" spacing="compact">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            <FileText className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Technical Resources
            </h2>
            <p className="mt-1 text-sm text-white/75">
              Download our latest catalogue and technical data sheets.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="inverse" size="xl">
            <Link href="/catalogues">Download Catalog</Link>
          </Button>
          <Button asChild variant="inverseOutline" size="xl">
            <Link href="/contact?request=samples">Request Samples</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
