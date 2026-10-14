import { z } from "zod";

import { isLexicalDoc, lexicalHasVisibleText } from "@/lib/cms/lexical";
import { slugify } from "@/lib/cms/slug";

const contentId = z
  .string()
  .trim()
  .regex(
    /^(?:[a-f0-9]{24}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
    "Please choose a valid item."
  );

const lexicalContent = z.unknown().superRefine((value, ctx) => {
  if (value == null) return;
  if (!isLexicalDoc(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Article content is not in a readable format.",
    });
  }
});

const faqSchema = z.object({
  question: z.string().trim().min(1, "Enter a question."),
  answer: z.string().trim().min(1, "Enter an answer."),
});

export const postInputSchema = z.object({
  title: z.string().trim().min(1, "Please enter a title."),
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
  category: z.string().trim().optional().or(z.literal("")),
  author: z.string().trim().max(80).optional().or(z.literal("")),
  authorRole: z.string().trim().max(120).optional().or(z.literal("")),
  authorImageUrl: z.string().trim().optional().or(z.literal("")),
  authorImageAlt: z.string().trim().optional().or(z.literal("")),
  authorImageFilename: z.string().trim().optional().or(z.literal("")),
  authorImageWidth: z.number().nullable().optional(),
  authorImageHeight: z.number().nullable().optional(),
  authorImageId: z.string().trim().optional().or(z.literal("")),
  publishedAt: z.string().trim().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  tags: z.array(z.string().trim().min(1)).max(8, "Add up to 8 tags.").default([]),
  metaTitle: z.string().trim().max(120).optional().or(z.literal("")),
  metaDescription: z
    .string()
    .trim()
    .max(200, "Keep the meta description to 200 characters or fewer.")
    .optional()
    .or(z.literal("")),
  focusKeyword: z.string().trim().max(80).optional().or(z.literal("")),
  faqDescription: z.string().trim().max(300).optional().or(z.literal("")),
  faqs: z.array(faqSchema).default([]),
  _status: z.enum(["draft", "published"]),
});

export const postDraftSchema = postInputSchema.superRefine((value, ctx) => {
  if (value.category && !contentId.safeParse(value.category).success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["category"],
      message: "Please choose a valid category.",
    });
  }

  if (value.publishedAt?.trim()) {
    const parsed = Date.parse(value.publishedAt);
    if (Number.isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publishedAt"],
        message: "Enter a valid published date.",
      });
    }
  }

  if (value._status !== "published") return;

  if (!value.excerpt?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["excerpt"],
      message: "A short summary is required before publishing.",
    });
  }
  if (!value.author?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["author"],
      message: "Author name is required before publishing.",
    });
  }
  if (!value.authorRole?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["authorRole"],
      message: "Add what the author does before publishing.",
    });
  }
  if (!value.authorImageUrl?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["authorImageUrl"],
      message: "Upload an author photo before publishing.",
    });
  }
  if (!value.publishedAt?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["publishedAt"],
      message: "Published date is required before publishing.",
    });
  }
  if (!value.coverImageUrl?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["coverImageUrl"],
      message: "Please upload a cover image before publishing.",
    });
  }
  if (!value.category) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["category"],
      message: "Please choose a category before publishing.",
    });
  }
  if (!lexicalHasVisibleText(value.content)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["content"],
      message: "Add article content before publishing.",
    });
  }
});

export type PostInput = z.infer<typeof postDraftSchema>;
