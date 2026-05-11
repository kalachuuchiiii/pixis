import { type ReactNode } from "react";
import { useAuthUser } from "../../features/auth/hooks/useAuthUser";
import { Navigate } from "react-router-dom";

export const GuestGuard = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    isPending,
    isError,
    isFetching,
    isLoading,
  } = useAuthUser();

  if (isPending || isFetching || isLoading) return <></>;

  return !isError && user.id ? (
    <Navigate to={`/app/profile/${user.id}/decks`} />
  ) : (
    children
  );
};
