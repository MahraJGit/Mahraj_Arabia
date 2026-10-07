import { Target } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/layout/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import {
  aboutPromise,
  deliveryApproach,
} from "@/content/delivery-approach";

type DeliveryApproachProps = {
  id?: string;
  showPromise?: boolean;
  footer?: React.ReactNode;
  className?: string;
};

export function DeliveryApproach({
  id,
  showPromise = false,
  footer,
  className,
}: DeliveryApproachProps) {
  const { eyebrow, title, description, steps } = deliveryApproach;

  return (
    <Section id={id} className={className}>
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-body">
          {description}
        </p>
      </div>

      <div className="relative mt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute top-[2.75rem] end-0 start-0 hidden h-px bg-brand/70 lg:block"
        />
        <Stagger className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <StaggerItem
              key={step.number}
              className="bg-surface-alt px-5 py-6"
            >
              <p className="text-sm font-semibold tracking-wide text-brand">
                {step.number}
              </p>
              <h3 className="mt-3 text-base font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {showPromise ? (
        <div className="mt-10 border-s-4 border-s-brand bg-surface-alt px-5 py-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand">
            <Target className="size-4" />
            Our Promise
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-body">
            {aboutPromise}
          </p>
        </div>
      ) : null}

      {footer ? <div className="mt-10 flex justify-center">{footer}</div> : null}
    </Section>
  );
}
