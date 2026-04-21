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
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useReduxHook";
import { capitalize } from "lodash";
import clsx from "clsx";

type DeckDisplay = DeckWithAuthor | DeckWithAuthorAndFlashcardPreview | Deck;

type DeckContextType = {
  deck: DeckDisplay;
};

const DeckContext = createContext<DeckContextType | null>(null);

const useDeck = () => {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("Use inside DeckPreviewCard");
  return ctx;
};

// --------------------
// Root
// --------------------
const Root = ({
  deck,
  children,
  ...props
}: {
  deck: DeckWithAuthorAndFlashcardPreview | Deck;
  children: React.ReactNode;
} & ComponentProps<"div">) => {
  return (
    <DeckContext.Provider value={{ deck }}>
      <div {...props}>{children}</div>
    </DeckContext.Provider>
  );
};

const Card = ({ children }: { children: ReactNode }) => {
  const { deck } = useDeck();

  return (
    <div
      className={clsx(
        "bg-white border h-full flex flex-col justify-between rounded-2xl p-6 shadow-sm overflow-hidden",
        `border-l-8 border-l-[${deck.color}]`
      )}
    >
      {children}
    </div>
  );
};

// --------------------
// Header
// --------------------
const Header = () => {
  const { deck } = useDeck();
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-[10px] font-semibold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
          {deck.topic}
        </h2>
        <h2 className="text-[10px] font-semibold uppercase text-stone-400">
          {deck.visibility}
        </h2>
      </div>
    </div>
  );
};

// --------------------
// Title
// --------------------
const Title = ({ textSize = 17.5 }: { textSize?: number }) => {
  const { deck } = useDeck();
  return (
    <header className="mb-3">
      <h1 className={`text-[${textSize}px] font-semibold text-stone-900 `}>
        {deck.title || <span className="opacity-50">Untitled</span>}
      </h1>
      <p className="text-xs gap-2">
        {deck.flashcardCount === 0 ? "No" : deck.flashcardCount}{' '}
        {deck.flashcardCount >= 2 ? "Flashcards" : "Flashcard"}
      </p>
    </header>
  );
};

const Footer = () => {
  const { deck } = useDeck();

  return (
    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
      <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
        <Calendar size={13} />
        <span>Created {formatDistanceToNow(new Date(deck.createdAt))}</span>
        <span>Updated {formatDistanceToNow(new Date(deck.updatedAt))}</span>
      </div>

      <nav className="space-x-2 flex items-center">
        <Link to={`/app/decks/${deck.id}`}>
          <Button className="my-btn">View Deck</Button>
        </Link>
      </nav>
    </div>
  );
};

// --------------------
// Export (Object.assign 🔥)
// --------------------

export const Default = ({ deck }: DeckContextType) => {
  return (
    <Root deck={deck}>
      <Card>
        <Header />
        <Title />
        <Footer />
      </Card>
    </Root>
  );
};

export const DeckDisplay = Object.assign(Root, {
  Root,
  Header,
  Title,
  Card,
  Default,
  Footer,
});
