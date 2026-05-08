import z from "zod";
import { idSchema } from "./user.schemas";
import { answerSchema } from "./flashcard.schemas";

export const examAnswerSchema = z.object({
  flashcardId: idSchema,
  answer: z.string(),
});
export const examAnswersSchema = z.array(examAnswerSchema);

export const resultDetailsSchema = z
  .object({
    totalPointsGained: z.coerce.number().nonnegative(),
    isStreakIncremented: z.boolean(),
    totalFlashcards: z.coerce.number().nonnegative(),
    correctCount: z.coerce.number().nonnegative(),
    accuracy: z.coerce.number().nonnegative(),
    isAbandoned: z.boolean(),
    isFinished: z.boolean(),
    deckId: idSchema,
  })
  .transform((d) => {
    const { accuracy } = d;
    const feedback =
      accuracy > 90
        ? "Outstanding"
        : accuracy > 80
          ? "Excellent"
          : accuracy > 70
            ? "Strong"
            : accuracy > 60
              ? "Good"
              : accuracy > 50
                ? "Fair"
                : accuracy > 40
                  ? "Developing"
                  : accuracy > 30
                    ? "Struggling"
                    : accuracy > 20
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
