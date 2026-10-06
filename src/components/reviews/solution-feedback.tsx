import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { SolutionFeedbackGrid } from "@/components/reviews/solution-feedback-grid";
import { solutionFeedbackFilters, solutionProjects } from "@/content/reviews";

export function SolutionFeedback() {
  // Media reads the filesystem, so the images are rendered here and handed to
  // the client grid as ready-made nodes.
  const media = Object.fromEntries(
    solutionProjects.map((project) => [
      project.slug,
      <Media
        key={project.slug}
        src={project.image}
        alt={project.title}
        className="aspect-[16/10]"
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
      />,
    ])
  );

  return (
    <Section id="solution-feedback">
      <SectionHeading
        align="center"
        title="Client Feedback Across Our Solutions"
      />

      <SolutionFeedbackGrid
        filters={solutionFeedbackFilters}
        projects={solutionProjects}
        media={media}
      />
    </Section>
  );
}
