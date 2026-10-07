import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Official Mahraj Arabia logo lockup.
 */
export function Logo({
  className,
  onDark = false,
  priority = false,
}: {
  className?: string;
  onDark?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center",
        onDark && "rounded-sm bg-white/95 px-2 py-1.5",
        className
      )}
      aria-label="Mahraj Arabia"
    >
      <Image
        src="/brand/mahraj-arabia-logo.png"
        alt="Mahraj Arabia"
        width={358}
        height={69}
        className="h-8 w-auto sm:h-9"
        priority={priority}
      />
    </Link>
  );
}
