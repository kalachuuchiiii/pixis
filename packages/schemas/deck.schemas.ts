import {
  TITLE_MAX,
  TITLE_MIN,
  TOPIC_MAX,
  TOPIC_MIN,
  TOTAL_FLASHCARDS_MAX,
  TOTAL_FLASHCARDS_MIN,
} from "@pixis/constants";

import z from "zod";
import { ColorSchema, IDSchema, PercentageSchema } from "./common.schemas";
import { TimestampSchema, VisibilitySchema } from "./common.schemas";
import { UserBadgeSchema } from "./user.schemas";

export const DeckTitleSchema = z
  .string()
  .min(TITLE_MIN, `Title must contain at least ${TITLE_MIN} character(s)`)
  .max(TITLE_MAX, `Title must contain at most ${TITLE_MAX} characters.`)
  .trim();

export const TotalFlashcardsSchema = z
  .number()
  .min(
    TOTAL_FLASHCARDS_MIN,
    `Total flashcards must be above ${TOTAL_FLASHCARDS_MIN}`
  )
  .max(
    TOTAL_FLASHCARDS_MAX,
    `You can only have ${TOTAL_FLASHCARDS_MAX} flashcards`
  );
export const TopicSchema = z
  .string()
  .min(TOPIC_MIN, `Topic must contain at least ${TOPIC_MIN} character`)
  .max(TOPIC_MAX, `Topic must contain at most ${TOPIC_MAX} characters`)
  .trim();

export const DeckFormSchema = z
  .object({
    title: DeckTitleSchema,
    color: ColorSchema,
    topic: TopicSchema,
    visibility: VisibilitySchema,
  })
  .strip();

export const DeckSchema = DeckFormSchema.extend({
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  flashcardCount: z.number().int().nonnegative(),
  id: IDSchema,
  user: UserBadgeSchema.optional(),
  userId: IDSchema,
  participantsCount: z.number().positive().default(0).catch(0),
  averageAccuracy: PercentageSchema.catch(0),
  userSavedDeckCount: z.number().positive().default(0).catch(0),
  deletedAt: TimestampSchema.nullable().optional(),
  savedByMe: z
    .object({
      id: IDSchema,
    })
    .nullable()
    .optional(),
}).strip();

export type Deck = z.infer<typeof DeckSchema>;
export type DeckForm = z.infer<typeof DeckFormSchema>;
