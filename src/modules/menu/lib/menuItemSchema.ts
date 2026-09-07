import { z } from "zod";

const DIETARY_TAGS = ["vegan", "gluten-free", "dairy-free", "contains-nuts"] as const;

/**
 * Shared verbatim by AdminItemForm's zodResolver and the
 * /api/admin/menu/items route's safeParse. No displayOrder (server-
 * computed, append-at-end within categoryId). `images` holds whatever
 * Storage URLs useAdminImageUpload has already attached client-side —
 * this schema doesn't touch Storage itself.
 */
export const menuItemInputSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().positive("Price must be greater than 0"),
  images: z.array(z.string()),
  dietaryTags: z.array(z.enum(DIETARY_TAGS)),
  isAvailable: z.boolean(),
  optionGroupIds: z.array(z.string()),
});

export type MenuItemInput = z.infer<typeof menuItemInputSchema>;
