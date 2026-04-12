import { Controller } from "react-hook-form";
import type { CreateOpenEndedForm } from "../hooks/useCreateFlashcard";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export const OpenEndedForm = ({
  openEndedForm,
  ...props
}: {
  openEndedForm: CreateOpenEndedForm;
} & ComponentProps<'form'>) => {
  const { control, watch } = openEndedForm;

  return (
    <form { ...props} >
      <header className="mb-4">
           <h1 className="text-4xl title">Open-Ended</h1>
      </header>
     <div className="space-y-2">
       <Controller
        name="question"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Question</FieldLabel>
            <Textarea {...field} placeholder="What is the capital of France?" />
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
              <CheckCircle  size={14}/> Accepted Answer
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
          <Field orientation={'horizontal'}>
          
            <Checkbox onCheckedChange={field.onChange} checked = {field.value}  />
              <FieldLabel>
              Case Sensitive
            </FieldLabel>
          </Field>
        )}
      />
     </div>
      <p className="my-3 text-xs text-stone-400 flex items-start gap-2">
        💡 Tip: Be specific and clear. Students can write their answers in their
        own words.
      </p>
    </form>
  );
};
