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

const Card = ({ children }: { children: ReactNode }) => {
  const { deck } = useDeck();

  return (
    <div className="relative">
      {/* Stacked Card Layers (Leak Effect) */}
      <div className="absolute -bottom-2 -right-2 w-full h-full opacity-25 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm rotate-[3deg]  z-0" />
      <div className="absolute -bottom-1 -right-1 w-full h-full bg-white opacity-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm rotate-[1.5deg]  z-10" />

      {/* Main Card */}
      <div
        className={clsx(
          "relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-7 shadow-sm h-full flex flex-col justify-between overflow-hidden z-20 transition-all group-hover:shadow-xl ",
          deck.color && `border-l-8 border-l-[${deck.color}]`
        )}
      >
        {children}
      </div>
    </div>
  );
};

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
        <span className="text-[10px] font-medium uppercase text-zinc-400 dark:text-zinc-500">
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
      <div className="flex items-start gap-4">
        <div
          className={`size-5 translate-y-1 rounded bg-[${deck.color}] shadow-[0px_0px_8px] shadow-[${deck.color}]`}
        />{" "}
        <h3 className="text-2xl  max-h-12 h-12 font-semibold text-zinc-900 dark:text-white  tracking-tight">
          {deck.title || <span className="opacity-40">Untitled Deck</span>}
        </h3>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
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
    <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
        <Calendar size={15} />
        <span>
          {formatDistanceToNow(new Date(deck.createdAt), { addSuffix: true })}
        </span>
      </div>

      <Link to={`/app/decks/${deck.id}/flashcards`}>
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
