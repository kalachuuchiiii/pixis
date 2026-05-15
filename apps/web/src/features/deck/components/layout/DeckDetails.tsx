import { NavLink, Outlet, useParams } from "react-router-dom";
import { DeckDisplay } from "../DeckDisplay";
import { CreditCard, History, Link2, Trophy } from "lucide-react";
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
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { copy } from "@/utils/copy";
import { ResultDetailsPopup } from "@/features/exam/components/ResultDetailsPopup";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { pop } from "@/hooks/usePopup";

const DeckDetails = () => {
  const { deckId = 0 } = useParams();
  const { data: user } = useAuthUser();
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
            {!deck.deletedAt && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => copy(window.location.href)}
                  variant={"outline"}
                  className="my-btn"
                >
                  <Link2 />
                </Button>
                <AddToCollectionDialog deckId={deckId} />
                <SaveOrUnsaveDeckButton deck={deck} />
              </div>
            )}
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
                "px-10 py-4 border-b-2 ",
                isActive && "border-b-zinc-900 dark:border-b-zinc-200"
              )
            }
          >
            <CreditCard />
          </NavLink>
          <NavLink
            to={`/app/decks/${deckId}/leaderboards`}
            className={({ isActive }) =>
              clsx(
                "px-10 py-4 border-b-2 ",
                isActive && "border-b-zinc-900 dark:border-b-zinc-200"
              )
            }
          >
            <Trophy />
          </NavLink>
          <NavLink
            to={`/app/decks/${deckId}/history`}
            className={({ isActive }) =>
              clsx(
                "px-10 py-4 border-b-2 ",
                isActive && "border-b-zinc-900 dark:border-b-zinc-200"
              )
            }
          >
            <History />
          </NavLink>
        </div>

        <div className="max-w-7xl w-full">
          <Outlet />
        </div>
      </div>
      {!deck.deletedAt && <StartAndSelectExamMode deck={deck} />}
    </>
  );
};

export default DeckDetails;
