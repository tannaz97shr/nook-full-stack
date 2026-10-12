import { z } from "zod";

/** Only a persona name is accepted — never an email — so the demo provider can only reach DEMO_ACCOUNTS. */
export const demoSignInSchema = z.object({
  persona: z.enum(["customer", "admin"]),
});
