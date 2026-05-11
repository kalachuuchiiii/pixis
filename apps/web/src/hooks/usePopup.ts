import { useState, type ComponentProps, type JSX, type ReactNode } from "react";

type PopupDisplay = undefined | (() => JSX.Element);
type PopupDetails = {
  open: boolean;
  display: PopupDisplay;
};

let externalSetState: React.Dispatch<React.SetStateAction<PopupDetails>>;

export const usePopup = () => {
  const [state, setState] = useState<PopupDetails>({
    open: false,
    display: undefined,
  });

  externalSetState = setState;

  return {
    state,
    setState,
  };
};

export const pop = (display?: PopupDisplay) => {
  if (!externalSetState) return;
  externalSetState({
    open: true,
    display,
  });
};

export const closePopup = () => {
  if (!externalSetState) return;
  externalSetState({
    open: false,
    display: undefined,
  });
};
