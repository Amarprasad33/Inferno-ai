import { z } from 'zod';

export const signupFormSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

export type SignupSchemaType = z.infer<typeof signupFormSchema>;

export const signinFormSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SigninSchemaType = z.infer<typeof signinFormSchema>;