import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight sm:text-2xl",
        onDark ? "text-white" : "text-ink",
        className
      )}
    >
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm sm:h-11 sm:w-11">
        <Image
          src="/brand/mahraj-arabia-logo.png"
          alt="Mahraj Arabia"
          fill
          sizes="44px"
          className="object-contain"
          priority
        />
      </span>
      <span>
        Mahraj <span className="text-brand">Arabia</span>
      </span>
    </Link>
  );
}
