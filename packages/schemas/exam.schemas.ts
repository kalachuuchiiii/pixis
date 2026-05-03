import z from "zod";
import { idSchema } from "./user.schemas";
import { answerSchema } from "./flashcard.schemas";

export const examAnswerSchema = z.object({
  flashcardId: idSchema,
  answer: answerSchema,
});
export const examAnswersSchema = z.array(examAnswerSchema);

export const resultDetailsSchema = z
  .object({
    totalPointsGained: z.coerce.number().nonnegative(),
    isStreakIncremented: z.boolean(),
    totalFlashcards: z.coerce.number().nonnegative(),
    correctCount: z.coerce.number().nonnegative(),
  })
  .transform((d) => {
    const correctPercentage =
      (d.correctCount / (d.totalFlashcards ?? null)) * 100;
    const feedback =
      correctPercentage > 90
        ? "Outstanding"
        : correctPercentage > 80
          ? "Excellent"
          : correctPercentage > 70
            ? "Strong"
            : correctPercentage > 60
              ? "Good"
              : correctPercentage > 50
                ? "Fair"
                : correctPercentage > 40
                  ? "Developing"
                  : correctPercentage > 30
                    ? "Struggling"
                    : correctPercentage > 20
                      ? "Very low"
                      : "Needs work";

    return {
      ...d,
      feedback,
    };
  });

export type ResultDetails = z.infer<typeof resultDetailsSchema>;
export type ExamAnswer = z.infer<typeof examAnswerSchema>;
export type ExamAnswers = z.infer<typeof examAnswersSchema>;
