import { z } from "zod";

import { slugify } from "@/lib/cms/slug";

export const categoryInputSchema = z.object({
  title: z.string().trim().min(1, "Please enter a category name."),
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
  subtitle: z.string().trim().max(160).optional().or(z.literal("")),
  image: z.string().trim().optional().or(z.literal("")),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  imageAlt: z.string().trim().optional().or(z.literal("")),
  imageFilename: z.string().trim().optional().or(z.literal("")),
  imageWidth: z.number().nullable().optional(),
  imageHeight: z.number().nullable().optional(),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
