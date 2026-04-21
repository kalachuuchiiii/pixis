import { z } from "zod";
import { VISIBILITY_ENUM } from "@pixis/constants";
import { idSchema, userBadgeSchema } from "./user.schemas";
import { timestampSchema } from "./timestamp.schemas";
import { visibilitySchema } from "./common.schemas";


export const collectionFormSchema = z.object({
  name: z.string().min(1).max(255),
  visibility: z.enum(VISIBILITY_ENUM),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Invalid hex color"),
});

export const collectionSchema = z.object({
  id: idSchema,
  name: z.string(),
  visibility: visibilitySchema,
  user: userBadgeSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  userId: idSchema,
  deckCount: z.coerce.number().nonnegative(),
  deletedAt: timestampSchema.optional().nullable(),
  color: z.string(),
});

export const collectionWithUserSchema = collectionSchema.and(z.object({ user: userBadgeSchema }))


export type CollectionForm = z.infer<typeof collectionFormSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type CollectionWithUser = z.infer<typeof collectionWithUserSchema>;
