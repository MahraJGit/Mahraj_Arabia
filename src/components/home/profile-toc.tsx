import Link from "next/link";

import { FadeIn, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";
import { profileToc } from "@/content/home";

export function ProfileToc() {
  return (
    <section
      id="introduction"
      data-section=""
      className="scroll-mt-28 border-b border-border bg-background py-14 md:py-16"
    >
      <Container>
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Explore
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Find what you need, quickly.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-body">
            Jump to solutions, project settings, delivery process, insights and
            contact. Everything organised for clear project planning.
          </p>
        </FadeIn>

        <Stagger className="mt-10 grid gap-0 border-y border-border sm:grid-cols-2 lg:grid-cols-3">
          {profileToc.map((item, index) => (
            <StaggerItem
              key={item.href}
              className="border-border sm:border-e sm:[&:nth-child(2n)]:max-lg:border-e-0 lg:[&:nth-child(3n)]:border-e-0"
            >
              <Link
                href={item.href}
                className="group flex items-baseline gap-4 px-1 py-5 transition-colors hover:bg-surface-alt sm:px-5"
              >
                <span className="font-heading text-sm font-semibold text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-semibold text-ink transition-colors group-hover:text-brand">
                  {item.label}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
