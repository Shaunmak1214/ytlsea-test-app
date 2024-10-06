import { z } from "zod"

export const loginSchema = z.object({
  // with error message of "Please input valid phone number."
  phoneNumber: z
    .string({
      message: "Please input valid phone number.",
    })
    .min(6, {
      message: "Please input valid phone number.",
    })
    .max(12, {
      message: "Please input valid phone number.",
    }),
})
