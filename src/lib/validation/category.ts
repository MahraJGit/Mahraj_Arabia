import { z } from "zod";

import { slugify } from "@/lib/cms/slug";

const optionalObjectId = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || /^[a-f0-9]{24}$/i.test(value), {
    message: "Please choose a valid image.",
  });

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
  image: optionalObjectId,
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
