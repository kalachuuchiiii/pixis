import z from "zod";
import { idSchema } from "./user.schemas";
import { answerSchema } from "./flashcard.schemas";


export const examAnswerSchema = z.object({ flashcardId: idSchema, answer: answerSchema });
export const examAnswersSchema = z.array(examAnswerSchema);

export type ExamAnswer = z.infer<typeof examAnswerSchema>;
export type ExamAnswers = z.infer<typeof examAnswersSchema>;