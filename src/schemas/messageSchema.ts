
import z from "zod"

export const MessageSchema = z.object({
    messages:z
    .string()
    .min(10,{message: "message must be of 10 characters"})
    .max(300,{message: "message must not more than  300 characters"})
}) 