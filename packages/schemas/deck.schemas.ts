import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  TITLE_MAX,
  TITLE_MIN,
  TOTAL_FLASHCARDS_MAX,
  TOTAL_FLASHCARDS_MIN,
} from "@pixis/constants";

import z from "zod";
import { idSchema, userBadgeSchema } from "./user.schemas";
import { timestampSchema } from "./timestamp.schemas";
import {
  flashcardFormSchema,
  questionSchema,
  typeSchema,
} from "./flashcard.schemas";
import { visibilitySchema } from "./common.schemas";

export const titleSchema = z.string().min(TITLE_MIN).max(TITLE_MAX);
export const totalFlashcardsSchema = z
  .number()
  .min(TOTAL_FLASHCARDS_MIN)
  .max(TOTAL_FLASHCARDS_MAX);
export const topicSchema = z.string().min(1).max(100);
export const colorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

export const rawDeckFormSchema = z
  .object({
    title: titleSchema,
    color: colorSchema,
    topic: topicSchema,
    visibility: visibilitySchema,
  })
  .strip();

export type RawDeckForm = z.infer<typeof rawDeckFormSchema>;

export const deckSchema = rawDeckFormSchema
  .extend({
    createdAt: timestampSchema,
    updatedAt: timestampSchema,
    flashcardCount: z.number().int().nonnegative(),
    id: idSchema,
    user: userBadgeSchema.optional(),
    userId: idSchema,
    participantsCount: z.number().positive().default(0).catch(0).optional(),
    averageAccuracy: z.float64().positive().default(0).catch(0).optional(),
    userSavedDeckCount: z.number().positive().default(0).catch(0),
    deletedAt: timestampSchema.nullable().optional(),

    savedByMe: z
      .object({
        id: idSchema,
      })
      .nullable()
      .optional(),
  })
  .strip();

export const flashcardPreviewSchema = z.object({
  type: typeSchema,
  question: questionSchema,
});

export const deckWithAuthorSchema = deckSchema.and(
  z.object({ user: userBadgeSchema })
);
export const deckWithAuthorAndFlashcardPreviewSchema = deckWithAuthorSchema.and(
  z.object({ flashcardPreview: flashcardPreviewSchema.optional().nullable() })
);

export type DeckWithAuthorAndFlashcardPreview = z.infer<
  typeof deckWithAuthorAndFlashcardPreviewSchema
>;
export type DeckWithAuthor = z.infer<typeof deckWithAuthorSchema>;
export type Deck = z.infer<typeof deckSchema>;
