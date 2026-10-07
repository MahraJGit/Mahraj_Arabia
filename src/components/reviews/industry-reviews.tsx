import { Media } from "@/components/media";
import { IndustryReviewsCarousel } from "@/components/reviews/industry-reviews-carousel";
import { Section } from "@/components/layout/section";
import { industryReviewFilters, industryReviews } from "@/content/reviews";

export function IndustryReviews() {
  const media = Object.fromEntries(
    industryReviews.map((review) => [
      review.industry,
      <Media
        key={review.industry}
        src={review.projectImage}
        alt={`${review.industry} project`}
        className="aspect-[4/3]"
        sizes="(min-width: 1024px) 16rem, 90vw"
      />,
    ])
  );

  return (
    <Section id="industry-reviews" tone="alt">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Testimonials
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          What our clients say.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-body">
          Real project experiences from different sites across the region, from
          dependable delivery to smooth installation and professional support.
        </p>
      </div>

      <IndustryReviewsCarousel
        filters={industryReviewFilters}
        reviews={industryReviews}
        media={media}
      />
    </Section>
  );
}
