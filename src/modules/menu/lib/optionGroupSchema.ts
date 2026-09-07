import { z } from "zod";

/**
 * `id` present on an option means "update this existing Option doc";
 * absent means "create a new one" — updateOptionGroup.ts diffs the
 * submitted list against the group's current optionIds on that basis,
 * and tx.delete()s any existing option missing from the submission.
 */
export const optionInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Option name is required"),
  priceModifier: z.number(),
  isAvailable: z.boolean(),
});

/**
 * Shared verbatim by AdminOptionGroupForm's zodResolver (options as a
 * useFieldArray) and the /api/admin/menu/option-groups route's safeParse.
 * Options are edited as part of the group, not standalone — see
 * createOptionGroup.ts/updateOptionGroup.ts for why.
 */
export const optionGroupInputSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    selectionType: z.enum(["single", "multiple"]),
    isRequired: z.boolean(),
    minSelect: z.number().int().min(0),
    maxSelect: z.number().int().min(0),
    options: z.array(optionInputSchema).min(1, "Add at least one option"),
  })
  .refine((data) => data.minSelect <= data.maxSelect, {
    message: "Minimum selections can't exceed the maximum",
    path: ["minSelect"],
  });

export type OptionGroupInput = z.infer<typeof optionGroupInputSchema>;
export type OptionInput = z.infer<typeof optionInputSchema>;
