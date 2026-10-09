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
