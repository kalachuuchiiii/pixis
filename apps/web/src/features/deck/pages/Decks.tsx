import { useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { IDSchema, type Deck } from "@pixis/schemas";
import { DeckFilter } from "@/features/deck/components/DeckFilter";
import { Link, NavLink, useParams } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { DeckDisplay } from "../components/DeckDisplay";
import { Astroid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyResource } from "../../../components/ui/EmptyResource";
import { Spinner } from "@/components/ui/spinner";
import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import { useDeckFilter } from "../hooks/useDeckFilter";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { DeckCreatorDialog } from "../components/DeckCreatorDialog";

const Decks = () => {
  const { data: user } = useAuthUser();
  const { userId = "0" } = useParams();
  const isMine = String(user.id) === userId;
  const deckFilter = useDeckFilter(isMine ? undefined : ["visibility"]);
  const infiniteDeckQuery = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      const queries = [`page=${pageParam}&limit=${4}`, deckFilter.query];
      const cleanId = IDSchema.parse(userId);
      const res = await api.get<{
        decks: Deck[];
        nextPage: number | null;
      }>(`/decks/${cleanId}/list/?${queries.join("&")}`);
      return res.data;
    },
    queryKey: ["decks", userId],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
  });
  const { isPending, isFetching, data, hasNextPage } = infiniteDeckQuery;
  const { ref } = useInViewRefetch(infiniteDeckQuery);

  const createDeckButtonRef = useRef<HTMLButtonElement | null>(null);
  const decks = data?.pages.flatMap((p) => p.decks) ?? [];

  return (
    <div className=" w-full ">
      <div className="flex items-center h-12   justify-end w-full gap-2">
        <DeckFilter
          deckFilter={deckFilter}
          additionalActions={[<DeckCreatorDialog ref={createDeckButtonRef} />]}
          menus={
            isMine
              ? [
                  <Link to={`/app/saved-decks`} className="w-full">
                    <Button variant={"ghost"} className="my-btn w-full ">
                      Saved decks
                    </Button>
                  </Link>,
                  <Link to={`/app/archived/decks`} className="w-full">
                    <Button variant={"ghost"} className="my-btn w-full">
                      Archive
                    </Button>
                  </Link>,
                ]
              : []
          }
        />
      </div>

      <div className="w-full">
        <div className=" grid my-6 grid-cols-1 lg:grid-cols-2 gap-6">
          {decks.map((d) => (
            <DeckDisplay.Default key={`${d.topic}.${d.id}`} deck={d} />
          ))}
        </div>
        <div className=" h-20 my-20">
          {isPending || isFetching ? (
            <Spinner className="w-full my-auto mx-auto" />
          ) : !hasNextPage && decks.length === 0 ? (
            isMine ? (
              <EmptyResource
                title="No decks yet"
                description="No decks yet. Start by creating one"
                content={
                  <div className="flex items-center gap-2">
                    <Button
                      variant={"outline"}
                      className="my-btn"
                      onClick={() => createDeckButtonRef.current?.click()}
                    >
                      Create manually
                    </Button>
                    <NavLink to={"/app/chat"}>
                      <Button className="my-btn">
                        {" "}
                        <Astroid /> Create with Pixis
                      </Button>
                    </NavLink>
                  </div>
                }
              />
            ) : (
              <EmptyResource title="No decks yet" description="" />
            )
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

export default Decks;
