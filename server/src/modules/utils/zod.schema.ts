import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(8)
});

export const loginSchema = z.object({});


export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
