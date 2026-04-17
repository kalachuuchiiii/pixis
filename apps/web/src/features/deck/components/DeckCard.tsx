import { createContext, useContext } from "react";
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

type DeckContextType = {
  deck: DeckWithAuthorAndFlashcardPreview;
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
}: {
  deck: DeckWithAuthorAndFlashcardPreview;
  children: React.ReactNode;
}) => {
  return (
    <DeckContext.Provider value={{ deck }}>
      <div className={`w-full mx-auto `}>
        <div
          className={clsx(
            "bg-white border h-full flex flex-col justify-between rounded-2xl p-6 shadow-sm overflow-hidden",
            `border-l-40 border-l-[${deck.color}]`
          )}
        >
          {children}
        </div>
      </div>
    </DeckContext.Provider>
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
const Title = () => {
  const { deck } = useDeck();
  return (
    <h1 className="text-[17px] font-semibold text-stone-900 ">
      {deck.title || <span className="opacity-50">Untitled</span>}
    </h1>
  );
};

// --------------------
// Description
// --------------------
const Description = () => {
  const { deck } = useDeck();
  return (
    <p className="text-[13.5px] text-stone-600 line-clamp-2 mb-5">
      {deck.description}
    </p>
  );
};

// --------------------
// Preview Block
// --------------------
const Preview = () => {
  const dtx = useDeck();

  if (!dtx || !dtx.deck.flashcardPreview) {
    return (
      <div className="bg-stone-50 text-xs p-2 border border-stone-100 rounded-xl mb-5">
        No available flashcard preview
      </div>
    );
  }

  return (
    <div className="bg-stone-50 border border-stone-100 rounded-xl mb-5">
      <span className="text-xs px-2">
        {capitalize(dtx.deck.flashcardPreview.type.replace("_", " "))}
      </span>
      <p className="text-[14px] pb-4 pt-2 px-4 font-medium text-stone-800">
        {dtx.deck.flashcardPreview.question}
      </p>
    </div>
  );
};

// --------------------
// Footer
// --------------------
const Footer = () => {
  const { deck } = useDeck();
  const { user } = useAppSelector((state) => state.profile);

  return (
    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
      <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
        <Calendar size={13} />
        <span>Created {formatDistanceToNow(new Date(deck.createdAt))}</span>
        <span>Updated {formatDistanceToNow(new Date(deck.updatedAt))}</span>
      </div>

      <nav className="space-x-2 flex items-center">
        {!deck.deletedAt && (
          <Link to={`/app/decks/${deck.id}`}>
            <Button className="my-btn">View Deck</Button>
          </Link>
        )}
        {deck.userId === user.id && (
          <Link to={`/app/decks/${deck.id}/manage`}>
            <Button variant="outline" className="my-btn">
              Manage Deck
            </Button>
          </Link>
        )}
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
      <Header />
      <Title />
      <Description />
      <Preview />
      <Footer />
    </Root>
  );
};

export const DeckCard = Object.assign(Root, {
  Root,
  Header,
  Title,
  Default,
  Description,
  Preview,
  Footer,
});
