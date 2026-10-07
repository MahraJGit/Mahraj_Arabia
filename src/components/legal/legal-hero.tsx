import { ProfileHero } from "@/components/layout/profile-hero";
import type { LegalDocument } from "@/content/legal";

export function LegalHero({ doc }: { doc: LegalDocument }) {
  return (
    <ProfileHero
      title={doc.title}
      description={doc.description}
      image={doc.heroImage}
      breadcrumb={[{ label: doc.breadcrumb }]}
      eyebrow="Legal"
      compact
      footer={
        <dl className="flex flex-wrap gap-3">
          {doc.highlights.map((item) => (
            <div
              key={item.label}
              className="border border-border bg-background px-4 py-3"
            >
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-body">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      }
    />
  );
}
