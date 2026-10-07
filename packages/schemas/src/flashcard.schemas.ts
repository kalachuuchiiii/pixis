import {
  ANSWER_MAX,
  ANSWER_MIN,
  CHOICES_MAX,
  CHOICES_MIN,
  QUESTION_MAX,
  QUESTION_MIN,
  FLASHCARD_TYPES,
} from "@pixis/constants";
import z from "zod";
import { DatesSchema, IDSchema } from "./common.schemas";
export const QuestionSchema = z
  .string()
  .min(QUESTION_MIN, {
    message: `Question must be at least ${QUESTION_MIN} characters`,
  })
  .max(QUESTION_MAX, {
    message: `Question must not exceed ${QUESTION_MAX} characters`,
  });

export const AnswerSchema = z
  .string()
  .min(ANSWER_MIN, {
    message: `Answer must be at least ${ANSWER_MIN} characters`,
  })
  .max(ANSWER_MAX, {
    message: `Answer must not exceed ${ANSWER_MAX} characters`,
  });

export const ChoicesSchema = z
  .array(AnswerSchema)
  .min(CHOICES_MIN, {
    message: `Must have at least ${CHOICES_MIN} choices`,
  })
  .max(CHOICES_MAX, {
    message: `Must not exceed ${CHOICES_MAX} choices`,
  });
export const FlashcardTypeSchema = z.enum(FLASHCARD_TYPES);

export const OpenEndedFlashcardFormSchema = z
  .object({
    type: z.literal("open_ended"),
    question: QuestionSchema,
    answer: AnswerSchema,
    choices: z.null().catch(null),
    isAnswerCaseSensitive: z.boolean().catch(false),
  })
  .strip();

export const CloseEndedFlashcardFormSchema = z
  .object({
    type: z.literal("close_ended"),
    question: QuestionSchema,
    answer: AnswerSchema,
    choices: ChoicesSchema,
    isAnswerCaseSensitive: z.literal(false).catch(false),
  })
  .refine((data) => data.choices.includes(data.answer))
  .strip();

export const FlashcardFormSchema = z.discriminatedUnion("type", [
  OpenEndedFlashcardFormSchema,
  CloseEndedFlashcardFormSchema,
]);

export const FlashcardIds = z.object({
  id: IDSchema,
  userId: IDSchema,
  deckId: IDSchema,
});

export const FlashcardSchema =
  FlashcardFormSchema.and(DatesSchema).and(FlashcardIds);

export type CloseEndedFlashcardForm = z.infer<
  typeof CloseEndedFlashcardFormSchema
>;
export type OpenEndedFlashcardForm = z.infer<
  typeof OpenEndedFlashcardFormSchema
>;

export type Flashcard = z.infer<typeof FlashcardSchema>;
export type FlashcardForm = z.infer<typeof FlashcardFormSchema>;
