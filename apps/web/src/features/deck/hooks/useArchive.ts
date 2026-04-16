import api from "@/lib/api";
import { getSuccessMessage } from "@/utils/message-extractor.utils";
import type { Deck } from "@pixis/schemas";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { getErrorMessage } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type InfiniteDeckData =
  | InfiniteData<
      {
        nextPage: number | undefined;
        archivedDecks: Deck[];
      },
      unknown
    >
  | undefined;

export const useArchive = (query: string = "") => {
  const queryClient = useQueryClient();
  const nav = useNavigate();

  const removeUpdatedDecks = (deckIds: number[]) => {
    queryClient.setQueryData(["archived", query], (old: InfiniteDeckData) => {
      if (!old) return;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          archivedDecks: page.archivedDecks.filter(
            (d) => !deckIds.includes(d.id)
          ),
        })),
      };
    });
  };

  const { mutate: deleteSelectedDecks, isPending: isDeletingDecks } =
    useMutation({
      mutationFn: async (deckIds: number[]) => {
        const promise = api.delete("/decks/permanent/bulk", {
          data: {
            deckIds,
          },
        });
        await toast.promise(promise, {
          loading: `Deleting ${deckIds.length} decks...`,
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
      mutationKey: ["delete-decks"],
      onSuccess: (_, deckIds) => {
        removeUpdatedDecks(deckIds);
      },
    });

  const { mutate: restoreSelectedIds, isPending: isRestoringDecks } =
    useMutation({
      mutationFn: async (deckIds: number[]) => {
        const promise = api.patch("/decks/restore/bulk", { deckIds });
        await toast.promise(promise, {
          loading: `Restoring ${deckIds.length} decks...`,
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
      mutationKey: ["delete-decks"],
      onSuccess: (_, deckIds) => {
        removeUpdatedDecks(deckIds);
      },
    });

  const { mutate: restoreDeck, isPending: isRestoringDeck } = useMutation({
    mutationFn: async (id: number) => {
      const promise = api.patch(`/decks/${id}/restore`);
      await toast.promise(promise, {
        loading: `Restoring deck...`,
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
    onSuccess: (_, id) => {
      removeUpdatedDecks([id]);
      nav("/app/decks");
    },
  });

  const { mutate: deleteDeck, isPending: isDeletingDeck } = useMutation({
    mutationFn: async (id: number) => {
      const promise = api.delete(`/decks/${id}/permanent`);
      await toast.promise(promise, {
        loading: `Deleting deck...`,
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
    mutationKey: ["delete-decks"],
    onSuccess: (_, id) => {
      removeUpdatedDecks([id]);
      nav("/app/archived/decks");
    },
  });

  return {
    deleteSelectedDecks,
    restoreSelectedIds,
    restoreDeck,
    deleteDeck,
    isDeletingDeck,
    isRestoringDeck,
    isDeletingDecks,
    isRestoringDecks,
  };
};
    