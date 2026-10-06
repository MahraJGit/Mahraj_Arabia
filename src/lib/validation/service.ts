import { z } from "zod";

import { slugify } from "@/lib/cms/slug";
import { DEFAULT_FAQS } from "@/lib/services/faqs";
import {
  DEFAULT_PROCESS_STEPS,
} from "@/lib/services/process";
import { normalizeHex } from "@/lib/services/colors";
import {
  PERFORMANCE_COLUMN_LABELS,
  SPACE_COLUMN_LABELS,
} from "@/lib/services/table-labels";

const objectId = z
  .string()
  .regex(/^[a-f0-9]{24}$/i, "Please choose a valid item.");

const applicationPoint = z.object({
  label: z.string().trim().min(1, "Enter a point."),
});

export const applicationSchema = z.object({
  title: z.string().trim().min(1, "Enter an application title."),
  description: z.string().trim().min(1, "Enter an application description."),
  icon: z.string().trim().optional().or(z.literal("")),
  points: z.array(applicationPoint).default([]),
});

export const performanceRowSchema = z.object({
  useCase: z.string().trim().min(1, "Enter a use case."),
  recommended: z.string().trim().min(1, "Enter a recommended thickness."),
  forceReduction: z.string().trim().min(1, "Enter force reduction."),
});

export const spaceRowSchema = z.object({
  useCase: z.string().trim().min(1, "Enter a use case."),
  recommended: z.string().trim().min(1, "Enter a recommended value."),
  impact: z.string().trim().min(1, "Enter impact."),
  slip: z.string().trim().min(1, "Enter slip rating."),
  acoustic: z.string().trim().min(1, "Enter acoustic rating."),
  maintenance: z.string().trim().min(1, "Enter maintenance."),
});

export const seoSchema = z.object({
  seoTitle: z.string().trim().max(120).optional().or(z.literal("")),
  seoDescription: z
    .string()
    .trim()
    .max(200, "Keep the SEO description to 200 characters or fewer.")
    .optional()
    .or(z.literal("")),
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
  parent: objectId,
  excerpt: z.string().trim().max(300, "Keep the summary to 300 characters or fewer."),
  image: z.string().optional().or(z.literal("")),
  overviewImage: z.string().optional().or(z.literal("")),
  relatedServices: z.array(objectId).default([]),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(10),
  showInMegaMenu: z.boolean().default(true),
  detailReady: z.boolean().default(false),
  heroTitle: z.string().trim().optional().or(z.literal("")),
  heroDescription: z.string().trim().optional().or(z.literal("")),
  overviewTitle: z.string().trim().optional().or(z.literal("")),
  overviewDescription: z.string().trim().optional().or(z.literal("")),
  guideTitle: z.string().trim().optional().or(z.literal("")),
  guideDescription: z.string().trim().optional().or(z.literal("")),
  applications: z.array(applicationSchema).default([]),
  showPerformanceMatrix: z.boolean().default(false),
  performanceTitle: z.string().trim().optional().or(z.literal("")),
  performanceDescription: z.string().trim().optional().or(z.literal("")),
  performanceLabels: z
    .tuple([z.string().trim().max(60), z.string().trim().max(60), z.string().trim().max(60)])
    .default([...PERFORMANCE_COLUMN_LABELS]),
  performanceRows: z.array(performanceRowSchema).default([]),
  density: z.string().trim().optional().or(z.literal("")),
  warranty: z.string().trim().optional().or(z.literal("")),
  brandingTitle: z.string().trim().optional().or(z.literal("")),
  brandingDescription: z.string().trim().optional().or(z.literal("")),
  brandColorLabel: z.string().trim().max(80).optional().or(z.literal("")),
  brandColors: z
    .array(
      z.object({
        hex: z
          .string()
          .trim()
          .refine((value) => Boolean(normalizeHex(value)), "Use a colour such as #111111."),
        selected: z.boolean().default(false),
      })
    )
    .max(8, "Add up to 8 colours.")
    .default([]),
  showSpaceRequirements: z.boolean().default(false),
  spaceTitle: z.string().trim().optional().or(z.literal("")),
  spaceDescription: z.string().trim().optional().or(z.literal("")),
  spaceLabels: z
    .tuple([
      z.string().trim().max(60),
      z.string().trim().max(60),
      z.string().trim().max(60),
      z.string().trim().max(60),
      z.string().trim().max(60),
      z.string().trim().max(60),
    ])
    .default([...SPACE_COLUMN_LABELS]),
  spaceRows: z.array(spaceRowSchema).default([]),
  showProcess: z.boolean().default(true),
  processTitle: z.string().trim().optional().or(z.literal("")),
  processDescription: z.string().trim().optional().or(z.literal("")),
  processSteps: z
    .array(z.object({ label: z.string().trim().min(1, "Enter a step name.") }))
    .default(DEFAULT_PROCESS_STEPS.map((label) => ({ label }))),
  faqIntro: z.string().trim().optional().or(z.literal("")),
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(1, "Enter a question."),
        answer: z.string().trim().min(1, "Enter an answer."),
      })
    )
    .default(DEFAULT_FAQS.map((faq) => ({ ...faq }))),
  caseStudiesTitle: z.string().trim().optional().or(z.literal("")),
  caseStudiesDescription: z.string().trim().optional().or(z.literal("")),
  projectsTitle: z.string().trim().optional().or(z.literal("")),
  projectsDescription: z.string().trim().optional().or(z.literal("")),
  seoTitle: z.string().trim().max(120).optional().or(z.literal("")),
  seoDescription: z
    .string()
    .trim()
    .max(200, "Keep the SEO description to 200 characters or fewer.")
    .optional()
    .or(z.literal("")),
  _status: z.enum(["draft", "published"]),
});

export const serviceDraftSchema = serviceBase.superRefine((value, ctx) => {
  if (value._status === "published") {
    if (!value.excerpt.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["excerpt"],
        message: "A short summary is required before publishing.",
      });
    }
    if (!value.image) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["image"],
        message: "Please choose an image before publishing.",
      });
    }
  }
});

export type ServiceInput = z.infer<typeof serviceDraftSchema>;
