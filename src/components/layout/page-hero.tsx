import {
  ProfileHero,
  type ProfileBreadcrumb,
} from "@/components/layout/profile-hero";

export function PageHero({
  title,
  description,
  breadcrumb,
  image,
  eyebrow,
}: {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href: string }[];
  image?: string;
  eyebrow?: string;
}) {
  const crumbs: ProfileBreadcrumb[] | undefined = breadcrumb?.map((crumb, index) =>
    index === breadcrumb.length - 1
      ? { label: crumb.label }
      : { label: crumb.label, href: crumb.href }
  );

  return (
    <ProfileHero
      title={title}
      description={description}
      breadcrumb={crumbs}
      image={image}
      eyebrow={eyebrow}
    />
  );
}
