import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import type { LegalDocument } from "@/content/legal";

function hasPublicAsset(src: string) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function LegalHero({ doc }: { doc: LegalDocument }) {
  const showImage = hasPublicAsset(doc.heroImage);

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
      />
      {showImage ? (
        <Image
          src={doc.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/92 via-black/70 to-black/30"
      />

      <Container className="flex min-h-[24rem] flex-col justify-center py-16 lg:min-h-[28rem] lg:py-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/75">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" />
              <span className="text-white">{doc.breadcrumb}</span>
            </li>
          </ol>
        </nav>

        <div className="mt-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Legal
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-[1.12] text-white sm:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
            {doc.description}
          </p>
        </div>

        <dl className="mt-9 flex flex-wrap gap-3">
          {doc.highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-md border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/60">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-white">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}