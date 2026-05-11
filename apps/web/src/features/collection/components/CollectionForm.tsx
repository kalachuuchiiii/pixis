import { Button } from "@/components/ui/button";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { VISIBILITY_OPTIONS } from "@/data/visibility";
import { VisibilityOptionButton } from "@/features/auth/components/ui/VisibilityOptionButton";
import type { CollectionForm as CF } from "@pixis/schemas";
import { Pipette } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { ColorPicker } from "react-beautiful-color";
import { Controller, type UseFormReturn } from "react-hook-form";

type CollectionFormHandlers = UseFormReturn<CF, any, CF>;

export const CollectionForm = ({
  collectionFormHandlers,
  header,
  footer,
  ...props
}: {
  collectionFormHandlers: CollectionFormHandlers;
  header: ReactNode;
  footer: ReactNode;
} & ComponentProps<"main">) => {
  const { control, watch, setValue } = collectionFormHandlers;
  const values = watch();
  const { visibility, color } = values;

  return (
    <main {...props}>
      <>{header}</>
      <main className="space-y-6">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...field} placeholder="e.g. My Collection in Science" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div>
            <FieldLabel>Color</FieldLabel>
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
                </div>
              </div>
            </ColorPicker>
          </div>
          <Controller
            name="visibility"
            control={control}
            render={({ fieldState }) => (
              <Field>
                <FieldLabel>Visibility</FieldLabel>
                <div className="grid grid-cols-2 gap-2.5">
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
      </main>
      <>{footer}</>
    </main>
  );
};
