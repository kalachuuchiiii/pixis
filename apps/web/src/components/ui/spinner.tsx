import { cn } from "@/lib/utils";
import { Atom } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Atom
      role="status"
      aria-label="Loading"
      className={cn(
        "size-14 mx-auto animate-spin [animation-duration:1.5s] text-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    />
  );
}

export { Spinner };
