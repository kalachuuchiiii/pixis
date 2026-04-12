import { Spinner } from "./spinner";

export const LoadingDisplay = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
      <main className="flex animate-fade-in-down items-center gap-4 justify-center">
        <Spinner  className=" size-20 "/>
      </main>
    </div>
  );
};
