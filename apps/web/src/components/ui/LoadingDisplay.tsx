import type { ComponentProps } from "react";
import { Spinner } from "./spinner";

export const LoadingDisplay = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
      <div {...props}>
        <main className="flex animate-fade-in-down items-center gap-4 justify-center">
          <Spinner className=" size-20 " />
        </main>
      </div>
    </div>
  );
};
