import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/motion/reveal";
import { Media } from "@/components/media";
import { Button } from "@/components/ui/button";
import { solutionStories } from "@/content/solution-stories";
import { cn } from "@/lib/utils";

export function SolutionStories() {
  return (
    <section id="solution-stories" className="scroll-mt-28 bg-background">
      {solutionStories.map((story, index) => {
        const imageRight = index % 2 === 0;

        return (
          <article
            key={story.href}
            className="border-b border-border last:border-b-0"
          >
            <div className="grid lg:grid-cols-2">
              <div
                className={cn(
                  "relative min-h-[18rem] bg-surface-alt sm:min-h-[22rem] lg:min-h-[28rem]",
                  imageRight ? "lg:order-2" : "lg:order-1"
                )}
              >
                <Media
                  src={story.image}
                  alt={story.title}
                  className="absolute inset-0 size-full"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>

              <FadeIn
                className={cn(
                  "flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-16",
                  imageRight ? "lg:order-1" : "lg:order-2"
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  {story.category}
                </p>
                <h2 className="mt-3 max-w-md font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {story.title}
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-body">
                  {story.description}
                </p>

                <ul className="mt-7 max-w-md space-y-3 border-t border-border pt-7">
                  {story.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-snug text-ink sm:text-[0.9375rem]"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button asChild variant="brand" size="lg">
                    <Link href={story.href}>
                      {story.cta}
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </article>
        );
      })}
    </section>
  );
}
