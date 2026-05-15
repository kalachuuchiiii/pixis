import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import type { GeneratedSet } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Eye, Users } from "lucide-react";
import { DeckDisplay } from "@/features/deck/components/DeckDisplay";
import { FlashcardView } from "@/features/flashcard/components/ui/FlashcardPreview";
import { Button } from "@/components/ui/button";
import { useAssistant } from "../hooks/useAssistant";

export const SetPreviewDialog = ({ messageId }: { messageId: number }) => {
  const { data: set, isLoading } = useQuery({
    queryFn: async () => {
      const res = await api.get<{ set: GeneratedSet }>(
        `/assistant/messages/${messageId}/set`
      );
      return res.data.set;
    },
    queryKey: ["set", messageId],
    staleTime: Infinity,
  });
  const { generateSet, isGeneratingSet } = useAssistant();

  if (isLoading) {
    return (
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Loading preview...</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center">
          Loading flashcards...
        </div>
      </DialogContent>
    );
  }

  if (!set) return null;

  return (
    <DialogContent className="min-w-6/12 w-full dialog-container max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader className=" pb-4 border-b">
        <div className="flex flex-col items-start mt-2">
          <DeckDisplay.Header
            color={set.color}
            topic={set.topic}
            visibility={set.visibility}
          />
          <DeckDisplay.Title
            flashcardCount={set.flashcards.length}
            title={set.title}
            color={set.color}
          />
        </div>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 overflow-y-auto py-6 pr-2 custom-scrollbar space-y-6">
        {set.flashcards.map((flashcard, index) => (
          <FlashcardView
            key={`${flashcard.question}.${flashcard.answer}.${index}`}
            flashcard={flashcard}
            color={set.color}
          />
        ))}

        {set.flashcards.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No flashcards in this set.
          </p>
        )}
      </div>

      <Button
        className="my-btn w-full"
        onClick={() => generateSet(set)}
        disabled={isGeneratingSet}
      >
        Save Set
      </Button>
    </DialogContent>
  );
};
