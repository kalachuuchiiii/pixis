import { useState } from "react";
import { useSecurityManager } from "../hooks/useSecurityManager";
import * as z from "zod";
import store from "@/app/store";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const getSchema = () =>
  z
    .string()
    .min(1)
    .max(50)
    .refine(
      (d) =>
        d ===
        `Delete my account: ${store.getState().profile.user.username}`,
      {
        message: "Confirmation text does not match",
      }
    );

export const DeleteAccountDialog = () => {
  const [confirmationInput, setConfirmationInput] = useState("");
  const { deleteAccount, isDeletingAccount } = useSecurityManager();

  const schema = getSchema();
  const isValid = schema.safeParse(confirmationInput).success;

  const username = store.getState().profile.user.username;
  const requiredText = `Delete my account: ${username}`;

  return (
    <div className="pt-8 border-t border-red-100">
      <p className="font-medium text-red-600 mb-1">Delete Account</p>
      <p className="text-sm text-stone-500 mb-5">
        Permanently delete your account and all data. This action cannot be
        undone.
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="px-8 py-3 text-sm border border-red-200 text-red-600 hover:bg-red-50 rounded-2xl transition">
            Delete My Account
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Type to confirm deletion
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-stone-500">
              Type:
              <span className="font-medium text-red-600 ml-1">
                {requiredText}
              </span>
            </p>

            <input
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-200"
              placeholder="Type confirmation here..."
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!isValid || isDeletingAccount}
              onClick={() => deleteAccount()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeletingAccount ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};