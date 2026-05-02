import type { VisibilityOption } from "@/data/visibility";
import type { Visibility } from "@pixis/constants";
import clsx from "clsx";
import type { ComponentProps } from "react";

export const VisibilityOptionButton = ({
  option,
  value,
  ...props
}: {
  option: VisibilityOption;
  value: Visibility;
} & ComponentProps<"button">) => {
  const active = value === option.value;

  return (
    <button
      key={option.value}
      type="button"
      {...props}
      className={clsx(
        "flex flex-col items-start gap-2 px-4 py-3.5 rounded-xl border text-left transition-all",
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
      )}
    >
      <span className={active ? "text-white" : "text-zinc-400"}>
        {option.icon}
      </span>
      <div>
        <p
          className={`text-[13px] font-semibold leading-tight ${active ? "text-white" : "text-zinc-800"}`}
        >
          {option.label}
        </p>
        <p
          className={`text-[11.5px] mt-0.5 leading-snug ${active ? "text-zinc-300" : "text-zinc-400"}`}
        >
          {option.desc}
        </p>
      </div>
    </button>
  );
};
