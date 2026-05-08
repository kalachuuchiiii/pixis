import clsx from "clsx";
import pixis from "/pixis.gif";
import { Zap } from "lucide-react";

export const PixisAvatar = ({ size = 28 }: { size?: number }) => (
  <div
    className="rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0"
    style={{ width: size, height: size }}
  >
    <img src={pixis} className={` h-full w-full`} />
  </div>
);

export const Pixis = ({
  size = "lg",
}: {
  size?: "xs" | "sm" | "md" | "lg";
}) => {
  return <div className={clsx(" ", `text-${size}`)}>pixis</div>;
};
