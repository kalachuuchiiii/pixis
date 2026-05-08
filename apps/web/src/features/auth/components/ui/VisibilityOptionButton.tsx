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
          ? "border-zinc-900 bg-zinc-900 dark:bg-neutral-100 dark:text-zinc-950 text-white"
          : "border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
      )}
    >
      <span
        className={
          active
            ? "text-white dark:text-zinc-900"
            : "text-zinc-400 dark:text-neutral-100"
        }
      >
        {option.icon}
      </span>
      <div
        className={`${active ? "text-white dark:text-zinc-950" : "text-zinc-800 dark:text-neutral-100"}`}
      >
        <p className={`text-[13px] font-semibold leading-tight `}>
          {option.label}
        </p>
        <p className={`text-[11.5px] mt-0.5 leading-snug`}>{option.desc}</p>
      </div>
    </button>
  );
};
