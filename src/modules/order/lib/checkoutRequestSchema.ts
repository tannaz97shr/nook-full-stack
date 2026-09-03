import { z } from "zod";

const checkoutRequestLineSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().positive(),
  selectedOptionIds: z.array(z.string().min(1)),
});

export const checkoutRequestSchema = z.object({
  lines: z.array(checkoutRequestLineSchema).min(1, "Cart is empty"),
  rewardId: z.string().min(1).nullable(),
});

export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;
