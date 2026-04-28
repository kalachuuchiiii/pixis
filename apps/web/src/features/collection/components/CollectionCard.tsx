import { createContext, useContext } from "react";
import type { Collection } from "@pixis/schemas";
import { formatDistanceToNow } from "date-fns";
import { LayoutGrid, User } from "lucide-react";
import { clsx } from "clsx";

type CollectionContextType = { collection: Collection };

const CollectionContext = createContext<CollectionContextType | null>(null);

const useCollection = () => {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error("useCollection must be used inside CollectionCard");
  return ctx;
};

// --------------------
// Root
// --------------------
const Root = ({
  collection,
  children,
  className,
}: {
  collection: Collection;
  children: React.ReactNode;
  className?: string;
}) => (
  <CollectionContext.Provider value={{ collection }}>
    <div className={clsx("group", className)}>
      <div
        className={clsx(
          "bg-stone-950 border border-stone-800 hover:border-stone-700 h-full flex flex-col justify-between rounded-3xl p-7 shadow-xl transition-all duration-300 overflow-hidden",
          collection.color && `border-l-8 border-l-[${collection.color}]`
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
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.5px] px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900">
          COLLECTION
        </span>
        <span className="text-xs uppercase font-medium text-stone-500">
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
    <h3 className="text-2xl font-semibold text-white tracking-tight leading-tight mb-6">
      {collection.name || <span className="opacity-40">Untitled Collection</span>}
    </h3>
  );
};

// --------------------
// Deck Count
// --------------------
const DeckCount = () => {
  const { collection } = useCollection();

  return (
    <div className="flex items-center gap-3 bg-stone-900/70 border border-stone-800 rounded-2xl px-5 py-4 mb-8">
      <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center">
        <LayoutGrid size={20} className="text-emerald-400" />
      </div>
      <div>
        <p className="text-3xl font-semibold text-white tabular-nums">
          {collection.deckCount}
        </p>
        <p className="text-sm text-stone-400 -mt-1">
          {collection.deckCount === 1 ? "deck" : "decks"}
        </p>
      </div>
    </div>
  );
};

// --------------------
// Author
// --------------------
const Author = () => {
  const { collection } = useCollection();

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-stone-400">
        <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center">
          <User size={14} />
        </div>
        <span className="font-medium text-white">@{collection.user.username}</span>
      </div>

      <p className="text-xs text-stone-500">
        {formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true })}
      </p>
    </div>
  );
};

// --------------------
// Default Export
// --------------------
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
  Default
});

