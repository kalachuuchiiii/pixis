import { CreateFlashcard } from "../components/CreateFlashcard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { type Flashcard } from "@pixis/schemas";
import api from "@/lib/api";
import {
  CloseEndedFlashcard,
  OpenEndedFlashcard,
} from "../components/MyFlashcard";
import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TimestampSort } from "@/components/TimestampSort";
import { useTimestampSort } from "@/hooks/useTimestampSort";

const FlashcardList = () => {
  const { deckId } = useParams();
  const timestampSortControl = useTimestampSort();
  const { timestampSortParam, timestampField, timestampOrder, toReadable } =
    timestampSortControl;
  const { data, refetch, isRefetching, isFetching } = useInfiniteQuery({
    queryKey: ["flashcards", deckId],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await api.get<{
        flashcards: Flashcard;
        nextPage: number | null;
        totalFlashcards: number;
      }>(
        `/flashcards/decks/${deckId}?page=${pageParam}&limit=${10}&sort=${timestampSortParam}`
      );
      return result.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const flashcards = data?.pages.flatMap((d) => d.flashcards);
  const totalFlashcards = data?.pages[0].totalFlashcards ?? 0;

  return (
    <div>
      <div className="flex items-end justify-between">
        <header>
          <h1
            className="text-[clamp(32px,5vw,48px)] font-normal text-stone-900 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            <span>{totalFlashcards} / 200</span> Flashcards
          </h1>
          <p className="text-[15px] text-stone-500 mt-2">
            Flashcards under this deck
          </p>
        </header>
        <Dialog>
          <DialogTrigger>
            <Button variant={"outline"} className="">
              Filter
              <Filter />
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-5/12">
            <main className="w-full space-y-6">
              <DialogHeader className="px-2 pt-2">
                <DialogTitle className="flex items-center gap-2">
                  <Filter /> Filter timestamps
                </DialogTitle>
              </DialogHeader>
              <TimestampSort {...timestampSortControl} />
              <DialogClose className="w-full">
                <Button
                  onClick={() => refetch()}
                  disabled={isFetching || isRefetching}
                  className="w-full"
                >
                  Filter
                </Button>
              </DialogClose>
            </main>
          </DialogContent>
        </Dialog>
      </div>

      <main className="grid grid-cols-2 mt-10 gap-2 place-content-center ">
        {flashcards &&
          flashcards.map((f) =>
            f.type === "open_ended" ? (
              <OpenEndedFlashcard flashcard={f} key={`${f.type}.${f.id}`} />
            ) : (
              <CloseEndedFlashcard flashcard={f} key={`${f.type}.${f.id}`} />
            )
          )}
      </main>
      <CreateFlashcard />
    </div>
  );
};

export default FlashcardList;
