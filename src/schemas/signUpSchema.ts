import z from "zod";



export const usernameValidation = z
            .string()
            .min(2,"username must atleast 2 char")
            .max(20,"username must not contain more than 20 char")
            .regex(/^[a-zA-Z0-9_]{2,20}$/,"username must not cintain special char")


export const signUpSchema = z.object({
    username:usernameValidation,
    email: z.string().email({message:"please provide a valid email"}),
    password:z.string().min(6,{message:"password size must be atleast 6 characters"})
})