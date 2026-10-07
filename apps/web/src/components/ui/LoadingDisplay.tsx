import type { ComponentProps } from "react";
import { Spinner } from "./spinner";

export const LoadingDisplay = ({ message, ...props }: { message?: string; } & ComponentProps<"div">) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
      <div {...props}>
        <main className="flex animate-fade-in-down items-center gap-2 justify-center">
          <>
            {message}
          </>
          <Spinner className=" size-20 " />
        </main>
      </div>
    </div>
  );
};
