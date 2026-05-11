import { z } from "zod";
import {
  COLLECTION_NAME_MAX,
  COLLECTION_NAME_MIN,
  VISIBILITY_ENUM,
} from "@pixis/constants";
import { ColorSchema, IDSchema } from "./common.schemas";

import { TimestampSchema, VisibilitySchema } from "./common.schemas";
import { UserBadgeSchema } from "./user.schemas";

export const CollectionNameSchema = z
  .string()
  .min(
    COLLECTION_NAME_MIN,
    `Collection name must be at least ${COLLECTION_NAME_MIN} characters`
  )
  .max(
    COLLECTION_NAME_MAX,
    `Collection name must not exceed ${COLLECTION_NAME_MAX} characters`
  )
  .trim();

export const CollectionFormSchema = z.object({
  name: CollectionNameSchema,
  visibility: VisibilitySchema,
  color: ColorSchema,
});

export const CollectionSchema = z.object({
  id: IDSchema,
  name: CollectionNameSchema,
  visibility: VisibilitySchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  userId: IDSchema,
  userSavedCollection: z
    .object({
      id: IDSchema,
    })
    .optional()
    .nullable(),
  userSavedCollectionCount: z.number().nonnegative(),
  deckCount: z.coerce.number().nonnegative(),
  deletedAt: TimestampSchema.optional().nullable(),
  color: ColorSchema,
  user: UserBadgeSchema,
});

export type CollectionForm = z.infer<typeof CollectionFormSchema>;
export type Collection = z.infer<typeof CollectionSchema>;
