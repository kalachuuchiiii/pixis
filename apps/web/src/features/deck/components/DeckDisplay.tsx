import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import type { Deck } from "@pixis/schemas";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Eye, User } from "lucide-react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";
import { hexToRgb } from "react-beautiful-color";
import type { Visibility } from "@pixis/constants";

type DeckContextType = {
  deck: Deck;
};

const DeckContext = createContext<DeckContextType | null>(null);

const useDeck = () => {
  const ctx = useContext(DeckContext);
  if (!ctx) return { deck: null };
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
  deck: Deck;
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
    <div className="relative h-full w-full">
      {/* Stacked Card Layers (Leak Effect) */}
      <div className="absolute -bottom-2 -right-2 w-full h-full opacity-40 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm rotate-[3deg]  z-0" />
      <div className="absolute -bottom-1 -right-1 w-full h-full bg-white opacity-70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm rotate-[1.5deg]  z-10" />

      {/* Main Card */}
      <div
        className={clsx(
          "relative bg-white  dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-7 shadow-sm h-full flex flex-col justify-between overflow-hidden z-20 transition-all group-hover:shadow-xl ",
          deck?.color && `border-l-8 border-l-[${deck.color}]`
        )}
      >
        {children}
      </div>
    </div>
  );
};
type HeaderProps = {
  color?: string;
  topic?: string;
  visibility?: Visibility;
};

const Header = ({ color, topic, visibility }: HeaderProps) => {
  const { deck } = useDeck();

  const finalColor = deck?.color ?? color;
  const finalTopic = deck?.topic ?? topic;
  const finalVisibility = deck?.visibility ?? visibility;

  const rgb = finalColor ? hexToRgb(finalColor) : null;

  const brighten = (value: number, factor = 0.3) =>
    Math.round(value + (255 - value) * factor);

  const topicStyle = rgb
    ? {
        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.20)`,
        color: `rgb(${brighten(rgb.r)}, ${brighten(rgb.g)}, ${brighten(rgb.b)})`,
      }
    : {};

  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {finalTopic && (
          <span
            style={topicStyle}
            className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
          >
            {finalTopic}
          </span>
        )}

        <span className="text-[10px] font-medium uppercase text-zinc-400 dark:text-zinc-500">
          {finalVisibility || "Private"}
        </span>
      </div>
    </div>
  );
};
// --------------------
// Title & Stats
// --------------------
type TitleProps = {
  title?: string;
  color?: string;
  flashcardCount?: number;
};

const Title = ({ title, color, flashcardCount }: TitleProps) => {
  const { deck } = useDeck();

  const finalTitle = deck?.title ?? title ?? "";
  const finalColor = deck?.color ?? color ?? "#000000";
  const finalFlashcardCount = deck?.flashcardCount ?? flashcardCount ?? 0;

  return (
    <div className="mb-6">
      <div className="flex items-start gap-4">
        <div
          className="w-5 h-5 shrink-0  translate-y-1 rounded shadow-[0px_0px_8px]"
          style={{
            backgroundColor: finalColor,
            boxShadow: finalColor ? `0px 0px 8px ${finalColor}` : undefined,
          }}
        />

        <h3 className="text-2xl h-full mb-4 font-semibold text-zinc-900 dark:text-white tracking-tight">
          {finalTitle || <span className="opacity-40">Untitled Deck</span>}
        </h3>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
        {(deck?.participantsCount ?? 0) > 0 && (
          <div className="flex items-center gap-1">
            {deck?.participantsCount ?? 0} <User className="size-4" />
          </div>
        )}
        {finalFlashcardCount > 0 && (
          <span>{finalFlashcardCount} flashcard(s)</span>
        )}

        {(deck?.averageAccuracy || 0) > 0 && (
          <div className="flex items-center gap-1">
            {(deck?.averageAccuracy ?? 0).toFixed(2)}% accuracy
          </div>
        )}
        {(deck?.userSavedDeckCount ?? 0) > 0 && (
          <span>{deck?.userSavedDeckCount} saved</span>
        )}
      </div>
    </div>
  );
};

// --------------------
// Footer
// --------------------
type FooterProps = {
  createdAt?: string;
  id?: number;
};

const Footer = ({ createdAt, id }: FooterProps) => {
  const { deck } = useDeck();

  const finalCreatedAt = deck?.createdAt ?? createdAt;
  const finalId = deck?.id ?? id;

  return (
    <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
        <Calendar size={15} />
        <span>
          {finalCreatedAt &&
            formatDistanceToNow(new Date(finalCreatedAt), {
              addSuffix: true,
            })}
        </span>
      </div>

      <Link to={`/app/decks/${finalId}/flashcards`}>
        <Button variant="default" className="gap-2 my-btn cursor-pointer">
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
const Default = ({ deck }: { deck: Deck }) => (
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
