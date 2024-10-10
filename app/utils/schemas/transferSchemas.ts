import { z } from "zod"

export const transferSchema = (maxAmount: number) =>
  z.object({
    amount: z
      .number()
      .min(1, { message: "The minimum transfer amount is RM1.00" })
      .max(maxAmount || 100000, {
        message: `Exceeded max amount of RM${maxAmount.toFixed(2)}.`,
      }),
    description: z.string().optional(),
  })
