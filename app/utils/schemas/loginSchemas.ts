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
  password: z
    .string({
      message: "Please input valid password.",
    })
    .regex(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/, {
      message: "Password must have at least one character and 1 number.",
    }),
})
