import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Official Mahraj Arabia logo lockup.
 * Served unoptimized so Next.js does not recompress the PNG.
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
        onDark && "rounded-sm bg-white px-2 py-1.5",
        className
      )}
      aria-label="Mahraj Arabia"
    >
      <Image
        src="/brand/mahraj-arabia-logo.png"
        alt="Mahraj Arabia"
        width={358}
        height={69}
        quality={100}
        unoptimized
        className="h-9 w-auto sm:h-11"
        priority={priority}
      />
    </Link>
  );
}
