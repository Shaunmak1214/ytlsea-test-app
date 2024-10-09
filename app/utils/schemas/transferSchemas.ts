import { z } from "zod"

export const transferSchema = z.object({
  amount: z.string().min(1, { message: "Please input valid amount." }),
  description: z.string().min(1, { message: "Please input valid description." }),
})
