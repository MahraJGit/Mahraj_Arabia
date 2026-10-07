import Link from "next/link";

import { DeliveryApproach } from "@/components/shared/delivery-approach";
import { Button } from "@/components/ui/button";

export function CoreServices() {
  return (
    <DeliveryApproach
      id="working-process"
      footer={
        <Button asChild variant="brandOutline" size="xl">
          <Link href="/services">Explore Industry Solutions</Link>
        </Button>
      }
    />
  );
}
