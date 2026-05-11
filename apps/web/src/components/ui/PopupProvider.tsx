import { usePopup } from "@/hooks/usePopup";
import { Dialog, DialogContent } from "./dialog";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const PopupProvider = () => {
  const { state, setState } = usePopup();
  const location = useLocation();

  const handleOpenChange = () => {
    setState({
      open: false,
      display: undefined,
    });
  };

  return (
    <Dialog open={state.open} onOpenChange={() => handleOpenChange()}>
      <DialogContent className="w-11/12 lg:min-w-140  h-fit">
        {state.display && <state.display />}
      </DialogContent>
    </Dialog>
  );
};
