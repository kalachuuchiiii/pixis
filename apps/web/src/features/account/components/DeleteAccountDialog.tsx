import { useState } from "react";
import { useSecurityManager } from "../hooks/useSecurityManager";
import * as z from "zod";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useProfileDetails } from "../hooks/useProfileDetails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const DeleteAccountDialog = () => {
  const { data: user } = useProfileDetails();
  const [confirmationInput, setConfirmationInput] = useState("");
  const { deleteAccount, isDeletingAccount } = useSecurityManager();

  const schema = z
    .string()
    .min(1)
    .max(50)
    .refine((d) => d === `Delete my account: ${user.username}`, {
      message: "Confirmation text does not match",
    });
  const isValid = schema.safeParse(confirmationInput).success;
  const requiredText = `Delete my account: ${user.username}`;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between">
      <header>
        <p className="font-medium text-red-400">Delete Account</p>
        <p className="text-sm dark:text-stone-500 ">
          Permanently delete your account and all data. This action cannot be
          undone.
        </p>
      </header>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={"destructive"}
            className="my-btn w-full lg:w-fit my-3"
          >
            Delete My Account
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete my account</AlertDialogTitle>
            <AlertDialogDescription>
              Type to confirm deletion
            </AlertDialogDescription>
          </AlertDialogHeader>
          <main className="w-full">
            <div className="space-y-3">
              <p className="text-sm text-zinc-500">
                Type:
                <span className="font-medium text-red-400 ml-1">
                  {requiredText}
                </span>
              </p>

              <Input
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                className="w-full"
                placeholder="Type confirmation here..."
              />
            </div>
          </main>

          <main className="flex items-center justify-end gap-1">
            <AlertDialogCancel className="my-btn">
              Keep my account
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!isValid || isDeletingAccount}
              onClick={() => deleteAccount()}
              variant={"destructive"}
              className="my-btn"
            >
              Delete my account
            </AlertDialogAction>
          </main>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
