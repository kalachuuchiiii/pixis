import { createContext, useContext } from "react";
import type { Collection } from "@pixis/schemas";
import { formatDistanceToNow } from "date-fns";
import { clsx } from "clsx";
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import { Skeleton } from "boneyard-js/react";
import { Separator } from "@/components/ui/separator";
import { Astroid } from "lucide-react";

type CollectionContextType = { collection: Collection };

const CollectionContext = createContext<CollectionContextType | null>(null);

const useCollection = () => {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error("useCollection must be used inside CollectionCard");
  return ctx;
};

const Root = ({
  collection,
  children,
}: {
  collection: Collection;
  children: React.ReactNode;
}) => (
  <CollectionContext.Provider value={{ collection }}>
    <Skeleton name="collection-card" loading={!collection}>
      <div
        className={clsx(
          "group relative min-h-fit border border-zinc-800 rounded-2xl",
          "hover:border-zinc-700   transition-colors duration-200"
        )}
      >
        <Astroid
          className="absolute -top-4 -left-4 z-20 size-12"
          style={{
            color: collection.color,
          }}
        />
        <div
          className={clsx(
            "relative bg-neutral-50 dark:bg-zinc-925 ",
            "flex flex-col h-full"
          )}
        >
          {children}
        </div>
      </div>
    </Skeleton>
  </CollectionContext.Provider>
);

const Header = () => {
  const { collection } = useCollection();

  return (
    <div className="flex items-center gap-2 px-[22px] pt-[22px] ">
      <span className="uppercase font-bold lg:text-sm text-xs tracking-tighter opacity-50">
        Collection
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[.06em] text-zinc-600">
        {collection.visibility}
      </span>
    </div>
  );
};

const Title = () => {
  const { collection } = useCollection();

  return (
    <h3
      className={clsx(
        "px-[22px] mb-5 text-2xl lg:text-3xl line-clamp-2  font-bold leading-[1.15] tracking-tight"
      )}
    >
      {collection.name ?? "Untitled Collection"}
    </h3>
  );
};

const DeckCount = () => {
  const { collection } = useCollection();

  return (
    <div className="px-[22px]">
      <div className="flex items-end gap-1.5">
        <span className="font-mono text-[52px] font-medium leading-none tracking-[-0.04em] ">
          {collection.deckCount}
        </span>
      </div>
      <p className="text-[13px] font-semibold uppercase tracking-[.06em]  mt-0.5 mb-4">
        {collection.deckCount === 1 ? "Deck" : "Decks"}
      </p>
      <Separator className="mb-4" />
    </div>
  );
};

const Author = () => {
  const { collection } = useCollection();

  return (
    <div className="px-[22px] pb-[22px] flex items-center justify-between">
      <UserBadge.Default user={collection.user} />

      <span className="font-mono text-[11px] text-zinc-600">
        {formatDistanceToNow(new Date(collection.updatedAt), {
          addSuffix: true,
        })}
      </span>
    </div>
  );
};

const Default = ({ collection }: { collection: Collection }) => (
  <Root collection={collection}>
    <Header />
    <Title />
    <DeckCount />
    <Author />
  </Root>
);

export const CollectionCard = Object.assign(Root, {
  Root,
  Header,
  Title,
  DeckCount,
  Author,
  Default,
});
