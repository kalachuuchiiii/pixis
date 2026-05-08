import type { ComponentProps, ReactNode } from "react";

interface AppHeaderProps extends ComponentProps<"header"> {
  heading: string;
  subheading?: string;
  description: string;
  beside?: ReactNode;
}

export const AppHeader = ({
  heading,
  subheading,
  description,
  beside,
  className = "",
  ...props
}: AppHeaderProps) => {
  return (
    <header
      className={`flex flex-col  lg:flex-row lg:items-end gap-8 lg:gap-12 mb-12 ${className}`}
      {...props}
    >
      {/* Left Content */}
      <div className="flex-1 space-y-3">
        <h1
          className="text-3xl lg:text-4xl font-normal tracking-tighter text-zinc-900 dark:text-white"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          {heading}
        </h1>

        {(subheading || description) && (
          <div className="space-y-2">
            {subheading && (
              <h2 className="text-xl lg:text-2xl font-medium opacity-75 text-zinc-700 dark:text-zinc-300">
                {subheading}
              </h2>
            )}
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
        )}
      </div>

      {/* Right Side Content */}
      {beside && (
        <div className="flex-shrink-0 lg:w-auto lg:self-end ">{beside}</div>
      )}
    </header>
  );
};
