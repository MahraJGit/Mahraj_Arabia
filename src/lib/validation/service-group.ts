import { z } from "zod";

import { slugify } from "@/lib/cms/slug";

export const publishStatusSchema = z.enum(["draft", "published"]);

export const serviceGroupInputSchema = z.object({
  title: z.string().trim().min(1, "Please enter a name."),
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
  menuDescription: z
    .string()
    .trim()
    .max(200, "Keep this to 200 characters or fewer.")
    .optional()
    .or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(10),
  showInMegaMenu: z.boolean().default(true),
  _status: publishStatusSchema,
});

export type ServiceGroupInput = z.infer<typeof serviceGroupInputSchema>;
