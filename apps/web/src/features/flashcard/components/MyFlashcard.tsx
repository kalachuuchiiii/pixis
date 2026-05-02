import type { Flashcard } from "@pixis/schemas";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/utils/time.utils";
import { Check } from "lucide-react";
import { FlashcardTypeBadge } from "./ui/FlashcardTypeBadge";

const MyFlashcardFooter = ({ flashcard }: { flashcard: Flashcard }) => {
  return (
    <CardFooter className=" flex flex-col gap-4">
      <Link className="w-full" to={`/app/flashcards/${flashcard.id}/manage`}>
        <Button className="flex-1 w-full h-9 rounded-[8px] bg-zinc-900 text-white text-[13px] font-medium hover:opacity-80 transition-opacity">
          View Flashcard →
        </Button>
      </Link>

      {/* Timestamps */}
      <div className="flex gap-2 justify-between w-full text-[10px] text-zinc-400">
        <span>Created: {timeAgo(flashcard.createdAt)}</span>
        <span>Updated: {timeAgo(flashcard.updatedAt)}</span>
      </div>
    </CardFooter>
  );
};

export const MyFlashcardHeader = ({ flashcard }: { flashcard: Flashcard }) => (
  <CardHeader className="pt-2">
    <FlashcardTypeBadge type={flashcard.type} />
    <header>
      <p className="title opacity-50 ">Question</p>
      <p className="text-[15px] font-medium text-zinc-800 leading-snug">
        {flashcard.question}
      </p>
    </header>
  </CardHeader>
);

export const CloseEndedFlashcard = ({
  flashcard,
}: {
  flashcard: Flashcard & { type: "close_ended" };
}) => {
  return (
    <Card
      className="w-full border flex flex-col justify-between border-zinc-100 rounded-2xl shadow-sm hover:border-zinc-200 hover:shadow-md transition-all duration-200 bg-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <MyFlashcardHeader flashcard={flashcard} />
      <CardContent className=" h-full pb-4">
        <div className="mb-4">
          <p className="title opacity-50">Choices</p>
          <div className="grid grid-cols-2 gap-1.5">
            {flashcard.choices.map((choice, i) => {
              const isCorrect = choice === flashcard.answer;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] border ${
                    isCorrect
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-zinc-100 bg-zinc-50 text-zinc-700"
                  }`}
                >
                  <span className="flex-1">{choice}</span>
                  {isCorrect && <Check size={"16"} />}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <MyFlashcardFooter flashcard={flashcard} />
    </Card>
  );
};

type OpenEndedFlashcardType = Extract<Flashcard, { type: "open_ended" }>;

export const OpenEndedFlashcard = ({
  flashcard,
}: {
  flashcard: OpenEndedFlashcardType;
}) => {
  return (
    <Card
      className="w-full flex flex-col justify-between border border-zinc-100 rounded-2xl shadow-sm hover:border-zinc-200 hover:shadow-md transition-all duration-200 bg-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <MyFlashcardHeader flashcard={flashcard} />

      <CardContent className=" h-full pb-4">
        <div className="mb-1">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-zinc-400 mb-2">
            Answer
          </p>

          <div className="px-3 py-3 rounded-lg border border-green-200 bg-green-50 text-green-800">
            <p className="text-[13.5px] leading-relaxed">{flashcard.answer}</p>
          </div>
        </div>
      </CardContent>
      <MyFlashcardFooter flashcard={flashcard} />
    </Card>
  );
};
