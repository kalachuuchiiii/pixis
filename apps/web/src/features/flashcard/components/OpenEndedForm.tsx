import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { OpenEndedFlashcardForm } from "@pixis/schemas";

export type OpenEndedFormType = UseFormReturn<
  OpenEndedFlashcardForm,
  any,
  OpenEndedFlashcardForm
>;

export const OpenEndedForm = ({
  openEndedForm,
  ...props
}: {
  openEndedForm: OpenEndedFormType;
} & ComponentProps<"div">) => {
  const { control } = openEndedForm;

  return (
    <div {...props}>
      <div className="space-y-6">
        <Controller
          name="question"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Question</FieldLabel>
              <Textarea
                {...field}
                placeholder="What is the capital of France?"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="answer"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>
                <CheckCircle size={14} /> Accepted Answer
              </FieldLabel>
              <Textarea
                {...field}
                placeholder="Enter the correct answer here..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="isAnswerCaseSensitive"
          control={control}
          render={({ field }) => (
            <Field orientation={"horizontal"}>
              <Checkbox
                onCheckedChange={field.onChange}
                checked={field.value}
              />
              <FieldLabel>Case Sensitive</FieldLabel>
            </Field>
          )}
        />
      </div>
      <p className="my-3 text-xs text-zinc-400 flex items-start gap-2">
        💡 Tip: Be specific and clear. Students can write their answers in their
        own words.
      </p>
    </div>
  );
};
