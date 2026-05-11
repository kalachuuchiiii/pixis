import { IDSchema, UsernameSchema } from '@pixis/schemas';
import z from 'zod';

export const AuthUserSchema = z.object({
  username: UsernameSchema,
  point: z.object({ id: IDSchema }),
  streak: z.object({ id: IDSchema }),
  id: IDSchema,
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
