import { cn } from "@/lib/utils";

export function Eyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.18em] text-brand",
        className
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  onDark = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  align?: "start" | "center";
  onDark?: boolean;
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        centered && "md:flex-col md:items-center",
        className
      )}
    >
      <div
        className={cn(
          "max-w-2xl",
          centered && "mx-auto max-w-3xl text-center"
        )}
      >
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          className={cn(
            "mt-3 text-3xl font-semibold sm:text-4xl",
            onDark && "text-white"
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed text-body",
              onDark && "text-white/70"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
