import { usePopup } from "@/hooks/usePopup";
import { Dialog, DialogContent } from "./dialog";

export const PopupProvider = () => {
  const { state, setState } = usePopup();

  return (
    <Dialog
      open={state.open}
      onOpenChange={() => setState({ open: false, display: undefined })}
    >
      <DialogContent className="min-w-140  h-fit">
        {state.display && <state.display />}
      </DialogContent>
    </Dialog>
  );
};
