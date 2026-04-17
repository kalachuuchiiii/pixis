import type { ComponentProps, ReactNode } from "react";

export const AppHeader = ({
  heading,
  description,
  beside,
  ...props
}: {
  heading: string;
  description: string;
  beside?: ReactNode;
} & ComponentProps<'div'>) => {
  return (
    <header className="flex items-end w-full mb-12 my-6 justify-between">
      <div className="w-6/12" {...props}>
        <h1 className="heading text-5xl">{heading}</h1>
        <p className="description">{description}</p>
      </div>
      <div className="w-6/12">
        {beside}
      </div>
    </header>
  );
};
