import { Edit3, List } from "lucide-react";

export const FlashcardTypeBadge = ({
  type,
}: {
  type: "open_ended" | "close_ended";
}) => {
  return (
    <div className="border-b-1 pb-2 mb-2 flex items-center gap-2">
      {type === "close_ended" ? <List size={14} /> : <Edit3 size={14} />}
      <p className="text-xs">
        {type === "close_ended" ? "Close Ended" : "Open Ended"}
      </p>
    </div>
  );
};
