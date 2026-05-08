import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";

export const SignOutDialog = () => {
  const { signOut, isSigningOut } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
      <div>
        <p className="font-medium dark:text-neutral-100 ">Sign Out</p>
        <p className="text-sm dark:text-stone-500 ">Log out from this device</p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"secondary"} className="my-btn">
            Sign Out
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-end mt-4 gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSigningOut}
              onClick={() => signOut()}
            >
              Sign Out
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
