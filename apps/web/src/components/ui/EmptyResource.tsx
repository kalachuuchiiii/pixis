import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CreditCard } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyResourceProps {
  title: string;
  description: string;
  content?: ReactNode;
}

export const EmptyResource = ({
  title,
  description,
  content,
}: EmptyResourceProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <CreditCard />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="w-full">{content}</EmptyContent>
    </Empty>
  );
};
