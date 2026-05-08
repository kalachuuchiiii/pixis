import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { DeckDisplay } from "../DeckDisplay";
import { ChevronRight, CreditCard, History, Plus, Trophy } from "lucide-react";
import { DeleteDeckDialog } from "../DeleteDeckDialog";
import { SoftDeleteDeckDialog } from "../SoftDeleteDeckDialog";
import { RestoreDeckDialog } from "../RestoreDeckDialog";
import { UpdateDeckDialog } from "../UpdateDeckDialog";

import { AddToCollectionDialog } from "../../../collection-deck/components/AddToCollectionDialog";
import { SaveOrUnsaveDeckButton } from "@/features/user-saved-deck/components/SaveOrUnsaveDeckButton";
import { StartAndSelectExamMode } from "@/features/exam/components/StartAndSelectExamMode.tsx";
import { useDeckDetails } from "../../hooks/useDeckDetails";
import clsx from "clsx";
import { Separator } from "@/components/ui/separator";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import { UserBadge } from "@/features/account/components/ui/UserBadge";

const DeckDetails = () => {
  const { deckId = 0 } = useParams();
  const { data: user } = useProfileDetails();
  const { data: deck } = useDeckDetails();

  if (!deck) {
    return null;
  }

  return (
    <>
      <div className={`page-container  space-y-12 animate-fade-in-right`}>
        <header className="flex lg:flex-row flex-col items-start lg:items-end w-full justify-between">
          <DeckDisplay deck={deck}>
            <DeckDisplay.Header />
            <DeckDisplay.Title />
          </DeckDisplay>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <AddToCollectionDialog deckId={deckId} />
              <SaveOrUnsaveDeckButton deck={deck} />
            </div>
            {user.id === deck.userId && (
              <div className="flex items-center gap-2">
                <UpdateDeckDialog deck={deck} />
                {deck.deletedAt !== null ? (
                  <>
                    <RestoreDeckDialog deckId={Number(deckId || 0)} />
                    <DeleteDeckDialog deckId={Number(deckId || 0)} />
                  </>
                ) : (
                  <SoftDeleteDeckDialog deckId={Number(deckId || 0)} />
                )}
              </div>
            )}
          </div>
        </header>
        <div>
          <Separator className="my-4" />
          {deck.user && <UserBadge.Default user={deck.user} />}
          <Separator className="my-4" />
        </div>
        <div className="w-full flex items-center ">
          <NavLink
            to={`/app/decks/${deckId}/flashcards`}
            className={({ isActive }) =>
              clsx(
                "px-10 py-4 border-b-1 border-b-background",
                isActive && "border-b-zinc-200"
              )
            }
          >
            <CreditCard />
          </NavLink>
          <NavLink
            to={`/app/decks/${deckId}/leaderboards`}
            className={({ isActive }) =>
              clsx(
                "px-10 py-4 border-b-1 border-b-background",
                isActive && "border-b-zinc-200"
              )
            }
          >
            <Trophy />
          </NavLink>
          <NavLink
            to={`/app/decks/${deckId}/history`}
            className={({ isActive }) =>
              clsx(
                "px-10 py-4 border-b-1 border-b-background",
                isActive && "border-b-zinc-200"
              )
            }
          >
            <History />
          </NavLink>
        </div>

        <div className="max-w-6xl lg:w-15/16 mx-auto">
          <Outlet />
        </div>
      </div>
      <StartAndSelectExamMode deck={deck} />
    </>
  );
};

export default DeckDetails;
