import z from "zod";
import { IDSchema, PercentageSchema } from "./common.schemas";

export const ExamAnswerSchema = z.object({
  flashcardId: IDSchema,
  answer: z.string(),
});

export const ExamAnswersSchema = z.array(ExamAnswerSchema);
export const ResultDetailsSchema = z
  .object({
    totalPointsGained: z.coerce.number().nonnegative(),
    isStreakIncremented: z.boolean(),
    totalFlashcards: z.coerce.number().nonnegative(),
    correctCount: z.coerce.number().nonnegative(),
    accuracy: PercentageSchema,
    isIncomplete: z.boolean(),
    isCompleted: z.boolean(),
    deckId: IDSchema,
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

export type ResultDetails = z.infer<typeof ResultDetailsSchema>;
export type ExamAnswer = z.infer<typeof ExamAnswerSchema>;
export type ExamAnswers = z.infer<typeof ExamAnswersSchema>;
