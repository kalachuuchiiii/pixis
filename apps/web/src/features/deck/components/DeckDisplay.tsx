import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import type {
  Deck,
  DeckWithAuthor,
  DeckWithAuthorAndFlashcardPreview,
} from "@pixis/schemas";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";

type DeckDisplay = DeckWithAuthor | DeckWithAuthorAndFlashcardPreview | Deck;

type DeckContextType = {
  deck: DeckDisplay;
};

const DeckContext = createContext<DeckContextType | null>(null);

const useDeck = () => {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck must be used inside DeckDisplay");
  return ctx;
};

// --------------------
// Root
// --------------------
const Root = ({
  deck,
  children,
  className,
  ...props
}: {
  deck: DeckDisplay;
  children: ReactNode;
} & ComponentProps<"div">) => {
  return (
    <DeckContext.Provider value={{ deck }}>
      <div className={clsx("group", className)} {...props}>
        {children}
      </div>
    </DeckContext.Provider>
  );
};

// --------------------
// Card (Main Deck Card with Stack Effect)
// --------------------
const Card = ({ children }: { children: ReactNode }) => {
  const { deck } = useDeck();

  return (
    <div className="relative">
      {/* Stacked Card Layers (Leak Effect) */}
      <div className="absolute -bottom-2 -right-2 w-full h-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-sm rotate-[3deg]  z-0" />
      <div className="absolute -bottom-1 -right-1 w-full h-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-sm rotate-[1.5deg]  z-10" />

      {/* Main Card */}
      <div
        className={clsx(
          "relative bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-3xl p-7 shadow-sm h-full flex flex-col justify-between overflow-hidden z-20 transition-all group-hover:shadow-xl ",
          deck.color && `border-l-8 border-l-[${deck.color}]`
        )}
      >
        {children}
      </div>
    </div>
  );
};

// --------------------
// Header
// --------------------
const Header = () => {
  const { deck } = useDeck();

  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {deck.topic && (
          <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full">
            {deck.topic}
          </span>
        )}
        <span className="text-[10px] font-medium uppercase text-stone-400 dark:text-stone-500">
          {deck.visibility || "Private"}
        </span>
      </div>
    </div>
  );
};

// --------------------
// Title & Stats
// --------------------
const Title = () => {
  const { deck } = useDeck();

  return (
    <div className="mb-6">
      <h3 className="text-2xl font-semibold text-stone-900 dark:text-white leading-tight tracking-tight mb-3">
        {deck.title || <span className="opacity-40">Untitled Deck</span>}
      </h3>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-500 dark:text-stone-400">
        {deck.flashcardCount > 0 && (
          <span>{deck.flashcardCount} flashcard(s)</span>
        )}
        {deck.userSavedDeckCount > 0 && (
          <span>{deck.userSavedDeckCount} saved</span>
        )}
      </div>
    </div>
  );
};

// --------------------
// Footer
// --------------------
const Footer = () => {
  const { deck } = useDeck();

  return (
    <div className="pt-5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
        <Calendar size={15} />
        <span>
          {formatDistanceToNow(new Date(deck.createdAt), { addSuffix: true })}
        </span>
      </div>

      <Link to={`/app/decks/${deck.id}`}>
        <Button variant="default" size="sm" className="gap-2">
          <Eye size={16} />
          View Deck
        </Button>
      </Link>
    </div>
  );
};

// --------------------
// Default Export
// --------------------
const Default = ({ deck }: { deck: DeckDisplay }) => (
  <Root deck={deck}>
    <Card>
      <Header />
      <Title />
      <Footer />
    </Card>
  </Root>
);

// Compound Component
export const DeckDisplay = Object.assign(Root, {
  Root,
  Card,
  Header,
  Title,
  Default,
  Footer,
});

