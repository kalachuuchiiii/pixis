import { useRef } from "react";
import { CollectionFilter } from "../components/CollectionFilter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollectionCard } from "../components/CollectionCard";
import { useCollections } from "../hooks/useCollections";
import { Link, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { CollectionCreatorDialog } from "../components/CollectionCreatorDialog";

const Collections = () => {
  const { data: user } = useAuthUser();

  const { userId = "0" } = useParams();
  const isMine = String(user.id) === userId;

  const collectionTriggerRef = useRef<HTMLButtonElement | null>(null);

  const {
    collectionFilterHandlers,
    hasNextPage,
    isPending,
    isFetching,
    collections,
    ref,
  } = useCollections(isMine ? undefined : ["visibility"]);

  const hasNoMoreData = !hasNextPage && collections.length > 0;
  const hasNoData = !hasNextPage && collections.length === 0;
  const isLoading = isPending || isFetching;

  return (
    <div>
      <div className=" flex mb-16 items-center h-12 lg:gap-2 w-full">
        <CollectionFilter
          additionalActions={[
            isMine ? (
              <CollectionCreatorDialog ref={collectionTriggerRef} />
            ) : undefined,
          ]}
          menus={[
            isMine ? (
              <Link to={"/app/saved-collections"}>
                <Button className="my-btn w-full" variant={"ghost"}>
                  Saved collections
                </Button>
              </Link>
            ) : undefined,
          ]}
          collectionFilter={collectionFilterHandlers}
        />
      </div>
      <main className="grid my-6 lg:grid-cols-2 grid-cols-1 gap-4">
        {collections.map(
          (c, i) =>
            c?.id && (
              <Link
                className={`${i % 2 !== 0 && "lg:translate-y-8"}`}
                key={c.id}
                to={`/app/collections/${c.id}`}
              >
                <CollectionCard.Default collection={c} />
              </Link>
            )
        )}
      </main>
      <div className="my-20">
        {isLoading ? (
          <Spinner />
        ) : hasNoMoreData ? (
          <EmptyResource title="No more collections" description="" />
        ) : (
          hasNoData &&
          (isMine ? (
            <EmptyResource
              title="No collections"
              description="No collections yet. Start by creating one"
              content={
                <Button
                  className="my-btn"
                  onClick={() => collectionTriggerRef.current?.click()}
                >
                  <Plus /> Create
                </Button>
              }
            />
          ) : (
            <EmptyResource title="No collections " description="" />
          ))
        )}
      </div>
      <div ref={ref} />
    </div>
  );
};

export default Collections;
