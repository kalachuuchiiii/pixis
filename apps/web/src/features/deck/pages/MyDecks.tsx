import { useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  rawDeckFormSchema,
  type DeckWithAuthorAndFlashcardPreview,
  type RawDeckForm,
} from "@pixis/schemas";
import { DeckFilter } from "@/features/deck/components/DeckFilter";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { DeckDisplay } from "../components/DeckDisplay";
import { Archive, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmptyResource } from "../../../components/ui/EmptyResource";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useDeck } from "../hooks/useDeck";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeckForm } from "../components/DeckForm";
import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import { useDeckFilter } from "../hooks/useDeckFilter";

const MyDecks = () => {
  const deckFilter = useDeckFilter();
  const infiniteDeckQuery = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      const queries = [`page=${pageParam}&limit=${4}`, deckFilter.query];
      const res = await api.get<{
        decks: DeckWithAuthorAndFlashcardPreview[];
        nextPage: number | null;
      }>(`/decks/?${queries.join("&")}`);
      return res.data;
    },
    queryKey: ["my-decks", deckFilter.query],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
  });
  const { isPending, isFetching, data, hasNextPage } = infiniteDeckQuery;
  const { ref } = useInViewRefetch(infiniteDeckQuery);
  const { createDeck, isCreatingDeck } = useDeck();
  const deckForm = useForm<RawDeckForm>({
    defaultValues: {
      color: "#000000",
      title: "",
      topic: "",
      visibility: "private",
    },
    resolver: zodResolver(rawDeckFormSchema),
  });

  const onSubmit = deckForm.handleSubmit((data) => createDeck(data));

  const color = deckForm.watch("color");
  const createDeckButtonRef = useRef<HTMLButtonElement | null>(null);
  const decks = data?.pages.flatMap((p) => p.decks) ?? [];

  return (
    <div className="page-container animate-fade-in-right">
      <AppHeader
        heading={`My Decks`}
        description="Manage and continue studying your personal decksk"
        beside={
          <div className="flex items-center h-12  justify-end w-full gap-1">
            <DeckFilter deckFilter={deckFilter} />
            <Tooltip>
              <TooltipTrigger>
                <Link to={`/app/archived/decks`}>
                  <Button variant={"outline"} className="my-btn h-full">
                    <Archive />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Go to archived decks</TooltipContent>
            </Tooltip>
            <Dialog>
              <DialogTrigger ref={createDeckButtonRef}>
                <Button className="my-btn">
                  Create <Plus />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="p-0 min-w-8/12"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <div
                  className={`px-10 py-5 border-l-8 border-l-[${color}] rounded-xl`}
                >
                  <DeckForm
                    className="space-y-4"
                    deckForm={deckForm}
                    header={
                      <header className="mb-4">
                        <h1 className="heading text-4xl">Create Deck</h1>
                        <p className="description text-sm">
                          Fill in the details below, then start adding
                          flashcards.
                        </p>
                      </header>
                    }
                    footer={
                      <footer>
                        <DialogClose>
                          <Button variant={"outline"} className="my-btn">
                            Cancel
                          </Button>
                        </DialogClose>
                        <DialogClose>
                          <Button
                            disabled={isCreatingDeck}
                            onClick={onSubmit}
                            type="submit"
                            className="w-full my-btn w-10/12"
                          >
                            Save
                          </Button>
                        </DialogClose>
                      </footer>
                    }
                  />
                  <footer className="mt-4 mb-2"></footer>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div>
        <div className=" grid grid-cols-3 gap-2">
          {decks.map((d) => (
            <DeckDisplay.Default key={`${d.topic}.${d.id}`} deck={d} />
          ))}
        </div>
        <div className=" h-20 my-20">
          {isPending || isFetching ? (
            <Spinner className="w-full my-auto mx-auto" />
          ) : !hasNextPage && decks.length === 0 ? (
            <EmptyResource
              title="No decks yet"
              description="No decks yet. Start by creating one"
              content={
                <Button onClick={() => createDeckButtonRef.current?.click()}>
                  Create
                </Button>
              }
            />
          ) : (
            !hasNextPage && (
              <EmptyResource
                title="No more decks"
                description="No more decks to show"
                content={
                  <Link to={"/app/explore"}>
                    <Button>Explore</Button>
                  </Link>
                }
              />
            )
          )}
        </div>
      </div>
      <div className="h-2 w-full" ref={ref} /> 
    </div>
  );
};


export default MyDecks;
