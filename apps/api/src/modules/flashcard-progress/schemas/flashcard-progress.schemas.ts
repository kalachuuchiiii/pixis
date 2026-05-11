import { IDSchema } from '@pixis/schemas';
import z from 'zod';

export const flashcardProgressValuesSchema = z.object({
  flashcard: z.object({ id: IDSchema }),
  deck: z.object({ id: IDSchema }),
  user: z.object({ id: IDSchema }),
  session: z.object({ id: IDSchema }),
  isAnswerCorrect: z.boolean(),
});

export type FlashcardProgressValues = z.infer<
  typeof flashcardProgressValuesSchema
>;
