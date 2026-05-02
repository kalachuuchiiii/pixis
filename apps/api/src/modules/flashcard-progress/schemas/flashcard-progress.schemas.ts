import { idSchema } from '@pixis/schemas';
import z from 'zod';

export const flashcardProgressValuesSchema = z.object({
  flashcard: z.object({ id: idSchema }),
  deck: z.object({ id: idSchema }),
  user: z.object({ id: idSchema }),
  session: z.object({ id: idSchema }),
  isAnswerCorrect: z.boolean(),
});

export type FlashcardProgressValues = z.infer<
  typeof flashcardProgressValuesSchema
>;
