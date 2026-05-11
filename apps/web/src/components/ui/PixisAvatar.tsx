import clsx from "clsx";
import pixis from "/pixis.gif";

export const PixisAvatar = ({ size = 20 }: { size?: number }) => (
  <div
    className="rounded-lg flex items-center justify-center flex-shrink-0"
    style={{ width: size, height: size }}
  >
    <img src={pixis} className={` h-full w-full`} />
  </div>
);

export const Pixis = ({
  size = "lg",
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}) => {
  return <div className={clsx("tracking-tighter ", `text-${size}`)}>pixis</div>;
};
