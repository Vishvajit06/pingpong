
import z from "zod"

export const signInSchema = z.object({
    identifier: z.string().email({message:"please provide a valid email"}),
    password:z.string()
}) 