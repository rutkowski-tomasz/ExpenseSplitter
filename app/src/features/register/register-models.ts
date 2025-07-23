import { z } from 'zod';

export const registerFormSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  nickname: z.string()
    .min(1, 'Nickname is required'),
  password: z.string()
    .min(1, 'Password is required')
    .min(5, 'Password must be at least 5 characters'),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
