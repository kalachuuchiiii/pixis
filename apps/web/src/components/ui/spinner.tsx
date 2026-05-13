import { cn } from "@/lib/utils";
import { Astroid, Atom } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Astroid
      role="status"
      aria-label="Loading"
      className={cn(
        "size-14 mx-auto text-blue-400 dark:text-amber-300 animate-spin [animation-duration:1.5s] ",
        className
      )}
      {...props}
    />
  );
}

export { Spinner };
