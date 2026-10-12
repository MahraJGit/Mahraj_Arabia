import type { PublishStatus } from "@/lib/cms/types";

export type ServiceFamilyRow = {
  id: string;
  title: string;
  slug: string;
  menu_description: string;
  sort_order: number;
  show_in_mega_menu: boolean;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
};

export type BlogCategoryRow = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  image_id: string | null;
  image_url: string;
  image_alt: string;
  image_filename: string;
  image_width: number | null;
  image_height: number | null;
  created_at: string;
  updated_at: string;
};

export type ServiceFamilyWrite = {
  title: string;
  slug: string;
  menuDescription: string;
  sortOrder: number;
  showInMegaMenu: boolean;
  status: PublishStatus;
};

export type BlogCategoryWrite = {
  title: string;
  slug: string;
  subtitle: string;
  imageId: string | null;
  imageUrl: string;
  imageAlt: string;
  imageFilename: string;
  imageWidth: number | null;
  imageHeight: number | null;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ServiceHighlightItem = {
  title: string;
  description: string;
  icon: string;
  points: string[];
};

export type ServiceCaseStudyItem = {
  title: string;
  imageUrl: string;
  imageAlt: string;
  meta: string;
  badge: string;
  price: string;
};

export type CoverImageFields = {
  coverImageId: string | null;
  coverImageUrl: string;
  coverImageAlt: string;
  coverImageFilename: string;
  coverImageWidth: number | null;
  coverImageHeight: number | null;
};

export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  cover_image_id: string | null;
  cover_image_url: string;
  cover_image_alt: string;
  cover_image_filename: string;
  cover_image_width: number | null;
  cover_image_height: number | null;
  category_id: string | null;
  status: PublishStatus;
  tags: string[] | null;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  faqs: unknown;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // legacy columns may still exist
  seo_title?: string;
  seo_description?: string;
};

export type BlogPostWrite = CoverImageFields & {
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  categoryId: string | null;
  status: PublishStatus;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  faqs: FaqItem[];
  publishedAt: string | null;
};

export type ServiceRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  cover_image_id: string | null;
  cover_image_url: string;
  cover_image_alt: string;
  cover_image_filename: string;
  cover_image_width: number | null;
  cover_image_height: number | null;
  family_id: string;
  status: PublishStatus;
  tags: string[] | null;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  faqs: unknown;
  highlights_title?: string;
  highlights_description?: string;
  highlights?: unknown;
  case_studies_title?: string;
  case_studies_description?: string;
  case_studies?: unknown;
  sort_order: number;
  show_in_mega_menu: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceWrite = CoverImageFields & {
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  familyId: string;
  status: PublishStatus;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  faqs: FaqItem[];
  highlightsTitle: string;
  highlightsDescription: string;
  highlights: ServiceHighlightItem[];
  caseStudiesTitle: string;
  caseStudiesDescription: string;
  caseStudies: ServiceCaseStudyItem[];
  sortOrder: number;
  showInMegaMenu: boolean;
};
