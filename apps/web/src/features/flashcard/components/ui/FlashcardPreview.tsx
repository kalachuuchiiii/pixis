import clsx from "clsx";
import { capitalize } from "lodash";
import { Dot } from "lucide-react";

export const FlashcardView = ({
  flashcard,
  color,
}: {
  flashcard:
    | {
        type: "open_ended";
        question: string;
        answer: string;
        choices: null;
        isAnswerCaseSensitive: boolean;
      }
    | {
        type: "close_ended";
        question: string;
        answer: string;
        choices: string[];
        isAnswerCaseSensitive: false;
      };
  color: string;
}) => {
  const { type, question, answer, choices, isAnswerCaseSensitive } = flashcard;
  return (
    <div
      className={clsx(
        "rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 space-y-5"
      )}
      style={{
        borderLeft: color ? `6px solid ${color}` : undefined,
      }}
    >
      {/* Type */}
      <div className="text-xs font-medium text-zinc-500">
        {capitalize(type.replaceAll("_", " "))}
      </div>

      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-snug">
        {question}
      </h3>

      {type === "close_ended" && choices?.length ? (
        <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-xs font-medium text-zinc-500 mb-2">Choices</p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {choices.map((choice, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
              >
                <Dot className="mt-1 text-zinc-400" />
                {choice}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
        <p className="text-xs text-zinc-500">Answer</p>
        <p className="text-base font-medium text-zinc-900 dark:text-white">
          {answer}
        </p>
      </div>

      {typeof isAnswerCaseSensitive === "boolean" && (
        <p className="text-[11px] text-zinc-400">
          Case sensitive: {isAnswerCaseSensitive ? "Yes" : "No"}
        </p>
      )}
    </div>
  );
};
