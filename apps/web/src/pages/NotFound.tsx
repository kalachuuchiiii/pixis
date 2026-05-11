import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { Link } from "react-router-dom";

const NotFound = () => {
  const { data: user, isPending, isFetching } = useAuthUser();

  return (
    <div className="fixed inset-0 flex  flex-col items-center justify-center">
      {isPending && isFetching ? (
        <Spinner />
      ) : (
        <main className="text-center space-y-2 flex items-center flex-col justify-center">
          <div className="flex items-center gap-6 font-bold tracking-tight">
            <h1 className="text-2xl lg:text-3xl">404</h1>{" "}
            <Separator orientation="vertical" />{" "}
            <p className="text-xl lg:text-2xl">Page not found</p>
          </div>
          <p className="opacity-75 text-xs lg:w-full w-10/12 lg:text-sm">
            This page could've been removed, updated, or does not exist
          </p>
          <div className="flex items-center mt-2 justify-center gap-2">
            {user.id !== 0 ? (
              <Link to={`/app/profile/${user.id}/decks`}>
                <Button variant={"outline"} className="my-btn">
                  Home
                </Button>
              </Link>
            ) : (
              <Link to={`/sign-in`}>
                <Button variant={"outline"} className="my-btn">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default NotFound;
