import { DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { RawDeckForm } from "@pixis/schemas";
import { Controller, type UseFormReturn } from "react-hook-form";
import { QUICK_TOPICS } from "../data/quickTopics";
import { Pipette, Tag } from "lucide-react";
import { VisibilityOptionButton } from "@/features/auth/components/ui/VisibilityOptionButton";
import { memo } from "react";
import { ColorPicker } from "react-beautiful-color";
import { Button } from "@/components/ui/button";
import { VISIBILITY_OPTIONS } from "@/data/visibility";

type DeckFormProps = {
  deckForm: UseFormReturn<RawDeckForm>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export const DeckForm = memo(({ deckForm, header, footer }: DeckFormProps) => {
  const { control, setValue, watch } = deckForm;
  const visibility = watch("visibility");
  const color = watch("color") || "#3b82f6";

  return (
    <div className="space-y-8 my-4">
      {header}

      <div
        className="space-y-8"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                {...field}
                placeholder="e.g. Cell Biology — Chapter 3"
                className="dark:bg-zinc-900 dark:border-zinc-700"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Topic */}
        <Controller
          name="topic"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Topic</FieldLabel>
              <Input
                {...field}
                placeholder="e.g. Biology"
                className="dark:bg-zinc-900 dark:border-zinc-700"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

              {/* Quick Topics */}
              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setValue("topic", topic)}
                    className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 active:bg-zinc-100 transition-all text-zinc-700 dark:text-zinc-300"
                  >
                    <Tag size={14} strokeWidth={2.5} />
                    {topic}
                  </button>
                ))}
              </div>
            </Field>
          )}
        />

        {/* Color Picker + Visibility */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Color Picker */}
          <Field className="col-span-1">
            <FieldLabel>Deck Color</FieldLabel>

            <ColorPicker
              className=""
              onChange={(selectedColor) =>
                setValue("color", selectedColor.getHex())
              }
              color={{ type: "hex", value: color }}
            >
              <ColorPicker.Saturation className="h-52 rounded-xl mb-4" />

              <div className="flex items-center px-2 gap-4">
                <ColorPicker.EyeDropper>
                  <Button
                    variant="outline"
                    size="icon"
                    className="dark:bg-zinc-800"
                  >
                    <Pipette size={20} />
                  </Button>
                </ColorPicker.EyeDropper>

                <div className="flex-1 space-y-3">
                  <ColorPicker.Hue className="h-3 rounded" />
                  <ColorPicker.Alpha className="h-3 rounded" />
                </div>
              </div>
            </ColorPicker>
          </Field>

          {/* Visibility */}
          <Controller
            name="visibility"
            control={control}
            render={({ fieldState }) => (
              <Field className="col-span-2">
                <FieldLabel>Visibility</FieldLabel>
                <div className="grid grid-cols-3 gap-3">
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
      </div>

      {footer}
    </div>
  );
});
