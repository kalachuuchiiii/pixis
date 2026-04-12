import api from "@/lib/api";
import { rawDeckFormSchema, type Deck, type RawDeckForm } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeckForm } from "../components/DeckForm";
import { useDeck } from "../hooks/useDeck";
import _ from 'lodash';
import { useEffect, useMemo } from "react";
import { LoadingDisplay } from "@/components/ui/LoadingDisplay";

const DeckManager = () => {
  const deckForm = useForm<RawDeckForm>({
    defaultValues: {
      color: "#000000",
      title: "",
      description: "",
      topic: "",
      visibility: "public",
    },
    resolver: zodResolver(rawDeckFormSchema),
    mode: "onChange"
  });

  const { deckId = null,  } = useParams();
  const { updateDeck, isUpdatingDeck } = useDeck();
  const { handleSubmit, reset, watch } = deckForm;

  const { data, refetch, isFetching, isPending, isLoading } = useQuery({
    queryFn: async () => {
      const res = await api.get<{ deck: RawDeckForm }>(`/decks/${deckId}`);
      reset(res.data.deck);
      return res.data.deck;
    },
    queryKey: ["deck", deckId],
  });

  const onSubmit = handleSubmit(async (data) => {
    await updateDeck({ rawDeckForm: data, deckId: Number(deckId) });
    await refetch();
  });

  const values = watch()
  const hasNoChanges = useMemo(() => _.isEqual(data, values), [data, values]);

  if(isLoading || isPending || isFetching ){
    return <LoadingDisplay />
  }

  return (
    <div className="animate-fade-in-right">
      <div>
        <header className="mb-8">
          <h1
            className="text-4xl title"
          >
            Manage your deck
          </h1>
          <p className="label">
            Update your existing deck
          </p>
        </header>

        <DeckForm
          onSubmit={onSubmit}
          id="update-deck-form"
          deckForm={deckForm}
        />
        <footer className="mt-6 flex gap-1">
          <Link to={`/app/decks/${deckId}/manage/flashcards`}>
            <Button variant={"outline"} className="my-btn">
              Flashcards
            </Button>
          </Link>
          <Button
          
            form="update-deck-form"
            type="submit"
            className="my-btn w-10/12"
            disabled={hasNoChanges || isUpdatingDeck}
          >
            Update
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default DeckManager;
