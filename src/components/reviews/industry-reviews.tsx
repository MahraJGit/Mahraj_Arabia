import { Media } from "@/components/media";
import { IndustryReviewsCarousel } from "@/components/reviews/industry-reviews-carousel";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { industryReviewFilters, industryReviews } from "@/content/reviews";

export function IndustryReviews() {
  // Media reads the filesystem, so the images are rendered here and handed to
  // the client carousel as ready-made nodes.
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
      <SectionHeading
        align="center"
        title="What Our Clients Say"
        description="Real project experiences from different sites across the region, from dependable delivery to smooth installation and professional support."
      />

      <IndustryReviewsCarousel
        filters={industryReviewFilters}
        reviews={industryReviews}
        media={media}
      />
    </Section>
  );
}
