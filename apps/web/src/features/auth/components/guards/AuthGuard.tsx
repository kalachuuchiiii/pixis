import type { ReactNode } from "react";
import { useAuthUser } from "../../hooks/useAuthUser";
import { Navigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignIn from "../../pages/SignIn";
import { Spinner } from "@/components/ui/spinner";
import { createPortal } from "react-dom";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    isPending,
    isLoading,
    isFetching,
    isError,
  } = useAuthUser();

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
