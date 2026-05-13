import { memo, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import dashboard from "/dashboard.png";
import stats from "/stats.png";
import chat from "/chat.png";
import deckDetails from "/deck-details.png";

const ZoomImageOnClick = memo(
  ({ children, src }: { children: ReactNode; src: string | undefined }) => {
    return (
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent
          onCloseAutoFocus={(e) => e.preventDefault()}
          className=" p-0 rounded-4xl overflow-hidden min-w-[70vw] "
        >
          <div className="w-full h-full">
            <img src={src} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

export const ContentsDisplay = () => {
  return (
    <main className="p-2 w-full h-16 my-10 lg:h-200  relative ">
      <ZoomImageOnClick src={stats}>
        <img
          src={stats}
          className="image h-30 lg:h-100 absolute left-[10vw] top-4 lg:top-50 lg:left-50"
        />
      </ZoomImageOnClick>

      <ZoomImageOnClick src={dashboard}>
        <img
          src={dashboard}
          className="image absolute top-0 lg:top-30   left-0 lg:left-0    h-12 lg:h-46"
        />
      </ZoomImageOnClick>
      <ZoomImageOnClick src={chat}>
        <img
          src={chat}
          className="image absolute top-10  lg:top-60  right-10 lg:right-14  h-12 lg:h-46"
        />
      </ZoomImageOnClick>
      <ZoomImageOnClick src={deckDetails}>
        <img
          src={deckDetails}
          className="image absolute top-28 lg:top-130  left-4 lg:left-8  h-12 lg:h-46"
        />
      </ZoomImageOnClick>
    </main>
  );
};
