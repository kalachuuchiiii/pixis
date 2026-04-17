import {
  ANSWER_MAX,
  ANSWER_MIN,
  CHOICES_MAX,
  CHOICES_MIN,
  QUESTION_MAX,
  QUESTION_MIN,
  TYPE_ENUM,
} from "@pixis/constants";
import z from "zod";
import { idSchema } from "./user.schemas";
import { createdAtSchema, updatedAtSchema } from "./timestamp.schemas";

export const questionSchema = z.string().min(QUESTION_MIN).max(QUESTION_MAX);
export const answerSchema = z.string().min(ANSWER_MIN).max(ANSWER_MAX);
export const choicesSchema = z
  .array(answerSchema)
  .min(CHOICES_MIN)
  .max(CHOICES_MAX);

export const typeSchema = z.enum(TYPE_ENUM);

export const flashcardRefIds = z.object({
  deckId: idSchema,
  userId: idSchema,
});

export const openEndedFlashcardSchema = z
  .object({
    type: z.literal("open_ended"),
    question: questionSchema,
    answer: answerSchema,
    choices: z.null().catch(null),
    isAnswerCaseSensitive: z.boolean()
  })
  .strip();

export const closeEndedFlashcardSchema = z
  .object({
    type: z.literal("close_ended"),
    question: questionSchema,
    answer: answerSchema,
    choices: choicesSchema,
    isAnswerCaseSensitive: z.literal(false)
  })
  .refine((data) => data.choices.includes(data.answer))
  .strip();

export const flashcardFormSchema = z.discriminatedUnion("type", [
  openEndedFlashcardSchema,
  closeEndedFlashcardSchema,
]);

export const timestampSchema = z.object({
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema
});

export const flashcardSchema = flashcardFormSchema.and(flashcardRefIds).and(timestampSchema).and(z.object({ id: idSchema }));
export type CloseEndedFlashcardForm = z.infer<typeof closeEndedFlashcardSchema>;
export type OpenEndedFlashcardForm = z.infer<typeof openEndedFlashcardSchema>;

export type Flashcard = z.infer<typeof flashcardSchema>;
export type FlashcardForm = z.infer<typeof flashcardFormSchema>;
