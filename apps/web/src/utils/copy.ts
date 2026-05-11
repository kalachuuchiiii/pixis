import { toast } from "sonner";

export const copy = (
  data: string,
  customMessage: string = "Copied successfully!"
) => {
  navigator.clipboard.writeText(data);
  toast.info(customMessage, {
    className: "text-zinc-900",
  });
};
