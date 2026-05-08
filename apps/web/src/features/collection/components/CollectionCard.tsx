import { createContext, useContext } from "react";
import type { Collection } from "@pixis/schemas";
import { formatDistanceToNow } from "date-fns";
import { clsx } from "clsx";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserBadge } from "@/features/account/components/ui/UserBadge";

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
    <div
      className={clsx(
        "group relative overflow-hidden rounded-2xl",
        "hover:border-zinc-700 border border-zinc-800   transition-colors duration-200",
        ` shadow-[${collection.color}]`
      )}
    >
      {collection.color && (
        <div
          className={clsx(
            "absolute top-0 left-0 w-1 h-full overflow-hidden  z-10",
            `border-l-6 shadow-[0px_0px_16px] shadow-[${collection.color}] border-l-[${collection.color}]`
          )}
        />
      )}

      <div
        className={clsx(
          "relative bg-zinc-950 ",
          "flex flex-col h-full",

          collection.color && "pl-0"
        )}
      >
        {children}
      </div>
    </div>
  </CollectionContext.Provider>
);

const Header = () => {
  const { collection } = useCollection();

  return (
    <div className="flex items-center gap-2 px-[22px] pt-[22px] ">
      <span className="uppercase font-bold tracking-tighter opacity-50">
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
        "px-[22px] mb-5 text-2xl line-clamp-2 max-h-12 h-fit font-bold leading-[1.15] tracking-tight",
        collection.name ? "text-zinc-50" : "text-zinc-600"
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
        <span className="font-mono text-[52px] font-medium leading-none tracking-[-0.04em] text-zinc-50">
          {collection.deckCount}
        </span>
      </div>
      <p className="text-[13px] font-semibold uppercase tracking-[.06em] text-zinc-600 mt-0.5 mb-4">
        {collection.deckCount === 1 ? "Deck" : "Decks"}
      </p>

      <div className="h-px bg-zinc-800 mb-[18px]" />
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
