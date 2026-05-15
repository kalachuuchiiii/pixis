import { usePopup } from "@/hooks/usePopup";
import { Dialog, DialogContent } from "./dialog";

export const PopupProvider = () => {
  const { state, setState } = usePopup();

  const handleOpenChange = () => {
    setState({
      open: false,
      display: undefined,
    });
  };

  return (
    <Dialog open={state.open} onOpenChange={() => handleOpenChange()}>
      <DialogContent className="w-11/12 lg:min-w-140 dialog-container  h-fit">
        {state.display && <state.display />}
      </DialogContent>
    </Dialog>
  );
};
