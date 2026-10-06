import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

import { cn } from "@/lib/utils";

function existsInPublic(src: string) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

// CMS uploads are served from S3 through /api/media/file, so there is no local file to stat.
function isManagedAsset(src: string) {
  return /^https?:\/\//.test(src) || src.startsWith("/api/");
}

export function Media({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const managed = isManagedAsset(src);

  // Falls back to a labelled block for any asset not yet supplied, so missing
  // photography is visible during review instead of failing as a broken image.
  if (!managed && !existsInPublic(src)) {
    return (
      <div
        data-src={src}
        role="img"
        aria-label={alt}
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400",
          className
        )}
      >
        <span className="px-4 text-center text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-neutral-600">
          {alt}
        </span>
      </div>
    );
  }

  // S3 URLs are served as plain <img> tags so the browser never goes
  // through Next Image optimization (which breaks on S3 redirect responses).
  if (managed) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-alt", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-surface-alt", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-center"
      />
    </div>
  );
}
