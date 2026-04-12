import { DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { RawDeckForm } from "@pixis/schemas";
import { Controller, type UseFormReturn } from "react-hook-form";
import { QUICK_TOPICS } from "../data/quickTopics";
import { Tag } from "lucide-react";
import { VISIBILITY_OPTIONS } from "../data/visibilityOptions";
import { VisibilityOptionButton } from "@/features/auth/components/ui/VisibilityOptionButton";
import { Button } from "@/components/ui/button";
import { memo, type ComponentProps } from "react";

type DeckFormProp = UseFormReturn<RawDeckForm, any, RawDeckForm>;

export const DeckForm = memo(
  ({
    deckForm,
    ...props
  }: { deckForm: DeckFormProp } & ComponentProps<"form">) => {
    const { control, setValue, watch } = deckForm;
    const visibility = watch("visibility");
    return (
      <form {...props}>
        <div
          className="w-full space-y-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input {...field} placeholder="e.g. Cell Biology — Chapter 3" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Input
                  {...field}
                  placeholder="What's this deck about? (optional)"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="topic"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Topic</FieldLabel>
                <Input {...field} placeholder="e.g. Biology" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <div className=" flex flex-wrap gap-2">
                  {QUICK_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setValue("topic", topic)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 active:bg-stone-100 transition-colors text-stone-700"
                    >
                      <Tag size={13} strokeWidth={2.5} />
                      {topic}
                    </button>
                  ))}
                </div>
              </Field>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ fieldState }) => (
              <Field>
                <FieldLabel>Visibility</FieldLabel>
                <div className="grid grid-cols-3 gap-2.5">
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <VisibilityOptionButton
                      key={opt.value}
                      value={visibility}
                      option={opt}
                      onClick={() => setValue("visibility", opt.value)}
                    />
                  ))}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </form>
    );
  }
);
