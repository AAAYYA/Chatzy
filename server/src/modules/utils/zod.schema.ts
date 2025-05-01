import { z } from "zod";

export const registerSchema = z.object({});

export const loginSchema = z.object({});


export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
