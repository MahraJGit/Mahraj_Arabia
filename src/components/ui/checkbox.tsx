import * as React from "react";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "size-4 rounded border-input accent-brand focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  );
}

export { Checkbox };
