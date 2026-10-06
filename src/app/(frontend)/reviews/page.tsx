import type { Metadata } from "next";

import { IndustryReviews } from "@/components/reviews/industry-reviews";
import { ProjectExperience } from "@/components/reviews/project-experience";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewsCta } from "@/components/reviews/reviews-cta";
import { ReviewsFaq } from "@/components/reviews/reviews-faq";
import { ReviewsHero } from "@/components/reviews/reviews-hero";
import { SolutionFeedback } from "@/components/reviews/solution-feedback";
import { TrustMetrics } from "@/components/reviews/trust-metrics";
import { TrustedLogos } from "@/components/reviews/trusted-logos";
import { WhyClientsChoose } from "@/components/reviews/why-clients-choose";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Verified client feedback and project testimonials from teams working with Mahraj Arabia.",
};

export default function ReviewsPage() {
  return (
    <>
      <ReviewsHero />
      <TrustMetrics />
      <WhyClientsChoose />
      <IndustryReviews />
      {/* <SolutionFeedback /> */}
      <ReviewForm />
      {/* <TrustedLogos /> */}
      <ProjectExperience />
      <ReviewsFaq />
      <ReviewsCta />
    </>
  );
}
