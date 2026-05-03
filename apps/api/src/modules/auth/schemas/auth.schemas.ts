import { idSchema, usernameSchema } from '@pixis/schemas';
import z from 'zod';

export const authUserSchema = z.object({
  username: usernameSchema,
  point: z.object({ id: idSchema }),
  streak: z.object({ id: idSchema }),
  id: idSchema,
});

export type AuthUser = z.infer<typeof authUserSchema>;
