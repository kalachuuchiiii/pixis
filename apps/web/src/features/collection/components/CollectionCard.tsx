import { createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import type { Collection } from "@pixis/schemas";
import { formatDistanceToNow } from "date-fns";
import { LayoutGrid } from "lucide-react";

import { useAppSelector } from "@/hooks/useReduxHook";
import clsx from "clsx";

type CollectionContextType = { collection: Collection };

const CollectionContext = createContext<CollectionContextType | null>(null);

const useCollection = () => {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error("Use inside CollectionCard");
  return ctx;
};

// --------------------
// Root
// --------------------
const Root = ({
  collection,
  children,
}: {
  collection: Collection;
  children: React.ReactNode;
}) => (
  <CollectionContext.Provider value={{ collection }}>
    <div className="w-full mx-auto h-fit">
      <div
        className={clsx(
          "bg-white border h-full flex flex-col justify-between rounded-2xl p-6 shadow-sm overflow-hidden",
          `border-l-8 border-l-[${collection.color}]`
        )}
      >
        {children}
      </div>
    </div>
  </CollectionContext.Provider>
);

// --------------------
// Header
// --------------------
const Header = () => {
  const { collection } = useCollection();
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
          Collection
        </span>
        <span className="text-[10px] font-semibold uppercase text-stone-400">
          {collection.visibility}
        </span>
      </div>
    </div>
  );
};

// --------------------
// Title
// --------------------
const Title = () => {
  const { collection } = useCollection();
  return (
    <h1 className="text-[17px] text-start font-semibold text-stone-900">
      {collection.name || <span className="opacity-50">Untitled</span>}
    </h1>
  );
};

// --------------------
// Deck Count
// --------------------
const DeckCount = () => {
  const { collection } = useCollection();
  return (
    <div className="rounded-xl mb-5  py-2 flex items-center gap-2">
      <LayoutGrid size={14} className="text-stone-400" />
      <span className="text-[13px] text-stone-600">
        {collection.deckCount} {collection.deckCount === 1 ? "deck" : "decks"}
      </span>
    </div>
  );
};

// --------------------
// Footer
// --------------------

const Author = () => {
  const { collection } = useCollection();
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
      <span className="font-medium">@{collection.user.username}</span>
      <span>· {formatDistanceToNow(new Date(collection.updatedAt))} ago</span>
    </div>
  );
};



export const Default = ({ collection }: CollectionContextType) => (
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
  Default,
  Author,
});
