import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Globe, Lock, Link, Tag } from "lucide-react";
import { useCreateDeck } from "../hooks/useCreateDeck";
import { DESCRIPTION_MAX, TITLE_MAX, type Visibility } from "@pixis/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { VISIBILITY_OPTIONS } from "../data/visibilityOptions";
import { QUICK_TOPICS } from "../data/quickTopics";




export const CreateDeckDialog = () => {
  const {
    deckForm,
    handleChangeDeckForm,
    deckFormError,
    handleChangeVisibility,
    addTopic,
    createDeck,
    isCreatingDeck
  } = useCreateDeck();

  return (
    <Dialog  >
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>
              Create <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>New deck</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="min-w-8/12">
        <div
         className="w-full"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {/* Page header */}
          <DialogHeader className="mb-8">
            <DialogTitle className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400 mb-2">
              New deck
            </DialogTitle>
            <h1
              className="text-[28px] font-normal text-stone-900 leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Create a deck
            </h1>
            <p className="text-[14px] text-stone-400 mt-1.5">
              Fill in the details below, then start adding flashcards.
            </p>
          </DialogHeader>

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <Input
                name="title"
                value={deckForm.title}
                onChange={handleChangeDeckForm}
                placeholder="Title e.g. Cell Biology — Chapter 3"
                maxLength={TITLE_MAX}
                className="h-[42px] rounded-[10px] border-stone-200 bg-stone-50 text-[14px] text-stone-800 placeholder:text-stone-300 focus-visible:ring-0 focus-visible:border-stone-400 focus-visible:bg-white transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {/* Description */}
            <div>
              <Textarea
                name="description"
                value={deckForm.description}
                onChange={handleChangeDeckForm}
                placeholder="What's this deck about? (optional)"
                maxLength={DESCRIPTION_MAX}
                rows={3}
                className="rounded-[10px] border-stone-200 bg-stone-50 text-[14px] text-stone-800 placeholder:text-stone-300 focus-visible:ring-0 focus-visible:border-stone-400 focus-visible:bg-white transition-colors resize-none leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {/* Topic */}
            <div>
              <Input
                name="topic"
                value={deckForm.topic}
                onChange={handleChangeDeckForm}
                placeholder="e.g. Biology"
                className="h-[42px] rounded-[10px] border-stone-200 bg-stone-50 text-[14px] text-stone-800 placeholder:text-stone-300 focus-visible:ring-0 focus-visible:border-stone-400 focus-visible:bg-white transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />

              {/* Quick topic buttons */}
              <div className="w-full flex mt-3 items-center gap-2">
                <div className="w-2/12 text-center bg-white border-1 shadow-md rounded-xl p-2">
                    <Input onChange={handleChangeDeckForm} name="color" value={deckForm.color} type="color" />
                    <p>Theme</p>
                </div>
                <div className=" flex flex-wrap gap-2">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => addTopic(topic)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 active:bg-stone-100 transition-colors text-stone-700"
                  >
                    <Tag size={13} strokeWidth={2.5} />
                    {topic}
                  </button>
                ))}
              </div>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <div className="grid grid-cols-3 gap-2.5">
                {VISIBILITY_OPTIONS.map((opt) => {
                  const active = deckForm.visibility === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChangeVisibility(opt.value)}
                      className={`flex flex-col items-start gap-2 px-4 py-3.5 rounded-xl border text-left transition-all ${
                        active
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                      }`}
                    >
                      <span
                        className={active ? "text-white" : "text-stone-400"}
                      >
                        {opt.icon}
                      </span>
                      <div>
                        <p
                          className={`text-[13px] font-semibold leading-tight ${active ? "text-white" : "text-stone-800"}`}
                        >
                          {opt.label}
                        </p>
                        <p
                          className={`text-[11.5px] mt-0.5 leading-snug ${active ? "text-stone-300" : "text-stone-400"}`}
                        >
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={!!deckFormError || isCreatingDeck}
                onClick={() => createDeck()}
                type="button"
                className="flex-1 h-11 rounded-xl bg-stone-900 text-white text-[13.5px] font-medium hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save deck
              </button>
              <button
                type="button"
                className="h-11 px-5 rounded-xl border border-stone-200 text-stone-500 text-[13.5px] font-medium hover:bg-stone-50 hover:text-stone-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
