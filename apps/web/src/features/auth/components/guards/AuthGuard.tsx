import type { ReactNode } from "react";
import { useAuthUser } from "../../hooks/useAuthUser";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignIn from "../../pages/SignIn";
import { Spinner } from "@/components/ui/spinner";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isPending, isError } = useAuthUser();

  if (isPending)
    return (
      <div className="">
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <Spinner />
        </div>
      </div>
    );

  return isError ? (
    <div>
      <Dialog open={true}>
        <DialogContent>
          <SignIn />
        </DialogContent>
      </Dialog>
      {children}
    </div>
  ) : (
    children
  );
};
