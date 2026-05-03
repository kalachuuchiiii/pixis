import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { CloudBackup, Trash, X } from "lucide-react";
import { useState } from "react";
import type { UseArchiveSelectReturn } from "../hooks/useArchiveSelector";
import { useArchive } from "../hooks/useArchive";

export const SelectedDeckActions = ({ ...props }: UseArchiveSelectReturn) => {
  const {
    restoreSelectedIds,
    deleteSelectedDecks,
    isRestoringDecks,
    isDeletingDecks,
  } = useArchive();

  const { handleToggleIsSelecting, selected } = props;

  const [openDelete, setOpenDelete] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);

  return (
    <>
      <div className="fixed bottom-10 inset-x-0 flex justify-center z-50">
        <main className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 h-[8vh] rounded-xl px-4 py-3 shadow-sm w-full max-w-xl flex items-center justify-between">
          {/* Left */}
          <h1 className="text-sm text-muted-foreground">
            {selected.length} selected
          </h1>

          {/* Middle */}
          <div className="flex items-center gap-2">
            <Button
              disabled={isRestoringDecks}
              onClick={() => setOpenRestore(true)}
              variant="outline"
              size="sm"
            >
              <CloudBackup className="w-4 h-4" />
            </Button>

            <Button
              disabled={isDeletingDecks}
              onClick={() => setOpenDelete(true)}
              variant="destructive"
              size="sm"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>

          {/* Right */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleIsSelecting}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </main>
      </div>

      {/* DELETE ALERT */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="dark:bg-zinc-900 dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete decks?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selected.length} deck(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteSelectedDecks(selected)}
              disabled={isDeletingDecks}
              variant={"destructive"}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* RESTORE DIALOG */}
      <Dialog open={openRestore} onOpenChange={setOpenRestore}>
        <DialogContent className="dark:bg-zinc-900 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle>Restore decks?</DialogTitle>
            <DialogDescription>
              Restore {selected.length} deck(s) back to your collection.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenRestore(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => restoreSelectedIds(selected)}
              disabled={isRestoringDecks}
            >
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
