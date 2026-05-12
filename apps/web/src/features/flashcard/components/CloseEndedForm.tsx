import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnswerSchema, type CloseEndedFlashcardForm } from "@pixis/schemas";
import { useState, type ComponentProps } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHOICES_MAX } from "@pixis/constants";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/message-extractor.utils";

export type CloseEndedFormType = UseFormReturn<
  CloseEndedFlashcardForm,
  any,
  CloseEndedFlashcardForm
>;

export const CloseEndedForm = ({
  closeEndedForm,
  ...props
}: {
  closeEndedForm: CloseEndedFormType;
} & ComponentProps<"div">) => {
  const [choiceInput, setChoiceInput] = useState("");
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = closeEndedForm;
  const choices = watch("choices");
  const answer = watch("answer");

  const addChoice = () => {
    const { error } = AnswerSchema.safeParse(choiceInput);
    if (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      return;
    }
    setValue("choices", [...choices, choiceInput]);
    setChoiceInput("");
  };

  return (
    <div {...props}>
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

      {/* Choices */}
      <div className="mb-10">
        {/* Add new choice */}

        <Controller
          control={control}
          name="choices"
          render={({ fieldState }) => (
            <Field orientation={"vertical"} className="flex gap-2 mt-3">
              <div className="space-y-2">
                <FieldLabel>
                  {" "}
                  {choices.length} / {CHOICES_MAX} Create a new choice
                </FieldLabel>
                <section className="flex gap-2">
                  <Input
                    type="text"
                    className="p-5"
                    disabled={choices.length === CHOICES_MAX}
                    value={choiceInput}
                    form="none"
                    onChange={(e) => setChoiceInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addChoice()}
                    placeholder="Add new choice..."
                  />
                  <Button
                    className="p-5"
                    type="button"
                    onClick={addChoice}
                    disabled={
                      !choiceInput.trim() || choices.length === CHOICES_MAX
                    }
                  >
                    <Plus size={20} />
                    Add
                  </Button>
                </section>

                <FieldError errors={[fieldState.error]} />
              </div>
              <motion.div
                layout="preserve-aspect"
                className="gap-2 flex grid grid-cols-2 "
              >
                {choices.map((choice, index) => (
                  <Button
                    key={`${choices}.${index}`}
                    type="button"
                    variant={choice === answer ? "default" : "outline"}
                    className={
                      "w-full flex h-full items-center justify-between text-sm text-left p-3 font-thin"
                    }
                    onClick={() => setValue("answer", choice)}
                  >
                    <p className="h-full whitespace-normal break-words wrap min-h-8  ">
                      {choice}
                    </p>
                    <button
                      onClick={() =>
                        setValue(
                          "choices",
                          choices.filter((c) => c !== choice)
                        )
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </Button>
                ))}
              </motion.div>
              {errors.answer && <FieldError errors={[errors.answer]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
};
