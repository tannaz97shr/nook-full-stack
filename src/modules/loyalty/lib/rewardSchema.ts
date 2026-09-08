import { z } from "zod";

/**
 * Shared verbatim by AdminRewardForm's zodResolver and the
 * /api/admin/loyalty/rewards routes' safeParse.
 */
export const rewardInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  pointsCost: z.number().int().positive("Points cost must be greater than 0"),
  discountValue: z.number().positive("Discount value must be greater than 0"),
  isActive: z.boolean(),
});

export type RewardInput = z.infer<typeof rewardInputSchema>;
