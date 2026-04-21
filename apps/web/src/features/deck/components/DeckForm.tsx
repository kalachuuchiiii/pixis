import { DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { RawDeckForm } from "@pixis/schemas";
import { Controller, type UseFormReturn } from "react-hook-form";
import { QUICK_TOPICS } from "../data/quickTopics";
import { Pipette, Tag } from "lucide-react";
import { VisibilityOptionButton } from "@/features/auth/components/ui/VisibilityOptionButton";
import { memo, type ComponentProps, type ReactNode } from "react";
import { ColorPicker } from "react-beautiful-color";
import { Button } from "@/components/ui/button";
import { VISIBILITY_OPTIONS } from "@/data/visibility";

type DeckFormProp = UseFormReturn<RawDeckForm, any, RawDeckForm>;

export const DeckForm = memo(
  ({
    deckForm,
    header,
    footer,
    ...props
  }: {
    deckForm: DeckFormProp;
    header: ReactNode;
    footer: ReactNode;
  } & ComponentProps<'div'>) => {
    const { control, setValue, watch } = deckForm;
    const visibility = watch("visibility");
    const color = watch("color");
    return (
      <div {...props}>
        {header}
        <div
          className="w-full space-y-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <div className="space-y-4 w-full">
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g. Cell Biology — Chapter 3"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

        
            </div>
        
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
          <div className="flex items-center gap-6">
            <ColorPicker
              onChange={(color) => setValue("color", color.getHex())}
              color={{ type: "hex", value: color }}
              className="size-40"
            >
              <ColorPicker.Saturation className="flex-1 mb-3" />
              <div className="flex items-center  gap-3 p-3 pt-0">
                <ColorPicker.EyeDropper>
                  <Button variant={"outline"}>
                    <Pipette className="opacity-50" size={20} />
                  </Button>
                </ColorPicker.EyeDropper>
                <div className="flex-1 flex flex-col ml-2 gap-3">
                  <ColorPicker.Hue className="h-4" />
                  <ColorPicker.Alpha className="h-4" />
                </div>
              </div>
            </ColorPicker>
            <Controller
              name="visibility"
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
        </div>
        {footer}
      </div>
    );
  }
);
