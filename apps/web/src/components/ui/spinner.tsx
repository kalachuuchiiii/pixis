import { cn } from "@/lib/utils"
import { Atom, Loader2Icon } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Atom role="status" aria-label="Loading" className={cn("size-4 animate-spin [animation-duration:1.5s] text-zinc-900", className)} {...props} />
  )
}

export { Spinner }
