import { ProfileClosingCta } from "@/components/layout/profile-closing-cta";
import { reviewsCta } from "@/content/reviews";

export function ReviewsCta() {
  return (
    <ProfileClosingCta
      title={reviewsCta.title}
      description={reviewsCta.description}
      primaryLabel="Contact Us"
    />
  );
}
