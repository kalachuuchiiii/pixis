import { idSchema, usernameSchema } from '@pixis/schemas';
import z from 'zod';

export const authUserSchema = z.object({
  username: usernameSchema,
  pointId: idSchema,
  streakId: idSchema,
  id: idSchema,
});

export type AuthUser = z.infer<typeof authUserSchema>;
