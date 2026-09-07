import { z } from "zod";

/**
 * Shared verbatim by AdminCategoryForm's zodResolver and the
 * /api/admin/menu/categories route's safeParse — one schema per entity,
 * DRY. No displayOrder field: it's server-computed (append-at-end),
 * never client-submitted.
 */
export const categoryInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
