import type { VisibilityOption } from "@/features/deck/data/visibilityOptions";
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
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
      )}
    >
      <span className={active ? "text-white" : "text-stone-400"}>
        {option.icon}
      </span>
      <div>
        <p
          className={`text-[13px] font-semibold leading-tight ${active ? "text-white" : "text-stone-800"}`}
        >
          {option.label}
        </p>
        <p
          className={`text-[11.5px] mt-0.5 leading-snug ${active ? "text-stone-300" : "text-stone-400"}`}
        >
          {option.desc}
        </p>
      </div>
    </button>
  );
};
