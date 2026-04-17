import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  TITLE_MAX,
  TITLE_MIN,
  TOTAL_FLASHCARDS_MAX,
  TOTAL_FLASHCARDS_MIN,
  VISIBILITY_ENUM,
} from "@pixis/constants";

import z from "zod";
import {
  idSchema,
  userBadgeSchema,
} from "./user.schemas";
import {  timeSchema,  } from "./timestamp.schemas";
import { questionSchema, typeSchema } from "./flashcard.schemas";

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


export const deckSchema = rawDeckFormSchema
  .extend({
    createdAt: timeSchema,
    updatedAt: timeSchema,
    id: idSchema,
    userId: idSchema,
    respondentCount: z.number().positive().default(0).catch(0),
    savedCount: z.number().positive().default(0).catch(0),
    deletedAt: timeSchema.nullable().optional()
  })
  .strip();
  export const flashcardPreviewSchema = z.object({ type: typeSchema, question: questionSchema});

  export const deckWithAuthorSchema = deckSchema.and(z.object({ user: userBadgeSchema }));
  export const deckWithAuthorAndFlashcardPreviewSchema = deckWithAuthorSchema.and(z.object({ flashcardPreview: flashcardPreviewSchema.optional().nullable() }))

  export type DeckWithAuthorAndFlashcardPreview = z.infer<typeof deckWithAuthorAndFlashcardPreviewSchema>
  export type DeckWithAuthor = z.infer<typeof deckWithAuthorSchema>;
  export type Deck = z.infer<typeof deckSchema>;
