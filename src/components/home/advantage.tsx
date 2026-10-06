import { HardHat, Layers, ShieldCheck } from "lucide-react";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/layout/section-heading";
import { advantages } from "@/content/home";

const icons = [ShieldCheck, Layers, HardHat];

export function Advantage() {
  return (
    <Section tone="charcoal">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>The Mahraj Advantage</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Technical Expertise
            <span className="block">at Every Step</span>
          </h2>

          <ul className="mt-10 space-y-8">
            {advantages.map((advantage, index) => {
              const Icon = icons[index] ?? ShieldCheck;

              return (
                <li key={advantage.title} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {advantage.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                      {advantage.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <Media
          src="/images/advantage-installation.jpg"
          alt="Specialist crew coordinating site installation"
          className="aspect-[4/3] rounded-md"
          sizes="(min-width: 1024px) 45vw, 90vw"
        />
      </div>
    </Section>
  );
}
