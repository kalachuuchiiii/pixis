import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  SORT_BY_ENUM,
  TITLE_MAX,
  TITLE_MIN,
  TOTAL_FLASHCARDS_MAX,
  TOTAL_FLASHCARDS_MIN,
  VISIBILITY_ENUM,
} from "@pixis/constants";

import z from "zod";
import {
  avatarPublicUrlSchema,
  idSchema,
  nicknameSchema,
  usernameSchema,
} from "./user.schemas";

export const titleSchema = z.string().min(TITLE_MIN).max(TITLE_MAX);
export const descriptionSchema = z
  .string()
  .min(DESCRIPTION_MIN)
  .max(DESCRIPTION_MAX);

export const totalFlashcardsSchema = z
  .number()
  .min(TOTAL_FLASHCARDS_MIN)
  .max(TOTAL_FLASHCARDS_MAX);
export const topicSchema = z.string().min(1).max(60);
export const visibilitySchema = z.enum(VISIBILITY_ENUM);

export const rawDeckFormSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    topic: topicSchema,
    visibility: visibilitySchema,
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  })
  .strip();

export type RawDeckForm = z.infer<typeof rawDeckFormSchema>;

export const deckFilterParamsSchema = z.object({
  page: z.coerce.number().positive(),
  limit: z.coerce.number().positive().catch(10),
  sortBy: z.enum(SORT_BY_ENUM),
});

export const deckSchema = rawDeckFormSchema
  .extend({

    createdAt: z.coerce
      .date()
      .refine((d) => d < new Date())
      .transform((d) => d.toISOString()),
    updatedAt: z.coerce
      .date()
      .refine((d) => d < new Date())
      .transform((d) => d.toISOString()),
    id: idSchema,
    user: {
      username: usernameSchema,
      avatarPublicUrl: avatarPublicUrlSchema,
      nickname: nicknameSchema,
    },
  })
  .strip();

export type Deck = z.infer<typeof deckSchema>;
export type DeckFilterParams = z.infer<typeof deckFilterParamsSchema>;
