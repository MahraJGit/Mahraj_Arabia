import { z } from "zod";

import { isLexicalDoc, lexicalHasVisibleText } from "@/lib/cms/lexical";
import { slugify } from "@/lib/cms/slug";

const contentId = z
  .string()
  .regex(
    /^(?:[a-f0-9]{24}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
    "Please choose a valid family."
  );

const lexicalContent = z.unknown().superRefine((value, ctx) => {
  if (value == null) return;
  if (!isLexicalDoc(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Service content is not in a readable format.",
    });
  }
});

const faqSchema = z.object({
  question: z.string().trim().min(1, "Enter a question."),
  answer: z.string().trim().min(1, "Enter an answer."),
});

const highlightSchema = z.object({
  title: z.string().trim().min(1, "Enter a highlight title."),
  description: z.string().trim().min(1, "Enter a short description."),
  icon: z.string().trim().min(1, "Choose an icon."),
  points: z
    .array(z.string().trim().min(1, "Enter a point."))
    .max(6, "Add up to 6 points.")
    .default([]),
});

const caseStudySchema = z.object({
  title: z.string().trim().min(1, "Enter a case study title."),
  imageUrl: z.string().trim().min(1, "Upload an image."),
  imageAlt: z.string().trim().default(""),
  meta: z.string().trim().default(""),
  badge: z.string().trim().default(""),
  price: z.string().trim().default(""),
});

const serviceBase = z.object({
  title: z.string().trim().min(1, "Please enter a service name."),
  slug: z
    .string()
    .trim()
    .transform((value, ctx) => {
      const next = slugify(value);
      if (!next) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a URL slug.",
        });
        return z.NEVER;
      }
      return next;
    }),
  excerpt: z
    .string()
    .trim()
    .max(300, "Keep the summary to 300 characters or fewer.")
    .optional()
    .or(z.literal("")),
  content: lexicalContent,
  coverImageUrl: z.string().trim().optional().or(z.literal("")),
  coverImageAlt: z.string().trim().optional().or(z.literal("")),
  coverImageFilename: z.string().trim().optional().or(z.literal("")),
  coverImageWidth: z.number().nullable().optional(),
  coverImageHeight: z.number().nullable().optional(),
  coverImageId: z.string().trim().optional().or(z.literal("")),
  parent: contentId,
  tags: z.array(z.string().trim().min(1)).max(8, "Add up to 8 tags.").default([]),
  metaTitle: z.string().trim().max(120).optional().or(z.literal("")),
  metaDescription: z
    .string()
    .trim()
    .max(200, "Keep the meta description to 200 characters or fewer.")
    .optional()
    .or(z.literal("")),
  focusKeyword: z.string().trim().max(80).optional().or(z.literal("")),
  faqs: z.array(faqSchema).default([]),
  highlightsTitle: z.string().trim().max(120).optional().or(z.literal("")),
  highlightsDescription: z.string().trim().max(300).optional().or(z.literal("")),
  highlights: z.array(highlightSchema).max(6, "Add up to 6 highlights.").default([]),
  caseStudiesTitle: z.string().trim().max(120).optional().or(z.literal("")),
  caseStudiesDescription: z.string().trim().max(300).optional().or(z.literal("")),
  caseStudies: z.array(caseStudySchema).max(6, "Add up to 6 case studies.").default([]),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(10),
  showInMegaMenu: z.boolean().default(true),
  _status: z.enum(["draft", "published"]),
});

export const serviceDraftSchema = serviceBase.superRefine((value, ctx) => {
  if (value._status !== "published") return;

  if (!value.excerpt?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["excerpt"],
      message: "A short summary is required before publishing.",
    });
  }
  if (!value.coverImageUrl?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["coverImageUrl"],
      message: "Please upload a cover image before publishing.",
    });
  }
  if (!lexicalHasVisibleText(value.content)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["content"],
      message: "Add service content before publishing.",
    });
  }
});

export type ServiceInput = z.infer<typeof serviceDraftSchema>;
