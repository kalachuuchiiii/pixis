import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  flashcardFormSchema,
  type CloseEndedFlashcardForm,
  type FlashcardForm,
} from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import React, { useMemo, useState, type ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { CloseEndedForm } from "../components/CloseEndedForm";
import { OpenEndedForm } from "../components/OpenEndedForm";
import type {
  CreateCloseEndedForm as UpdateCloseEndedForm,
  CreateOpenEndedForm as UpdateOpenEndedForm,
} from "../hooks/useCreateFlashcard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useFlashcardManager } from "../hooks/useFlashcardManager";

const FlashcardManager = () => {
  const {
    handleChangeType,
    onSubmit,
    isUpdatingFlashcard,
    hasNoChanges,
    values,
    isPending,
    isFetching,
    isLoading,
    flashcardForm,
  } = useFlashcardManager();

  if (isPending || isLoading || isFetching) {
    return <LoadingDisplay />;
  }

  const submitButtonProps: ComponentProps<"button"> = {
    type: "submit",
    className: "grow-1 my-btn",
    disabled:
      isPending ||
      isFetching ||
      isLoading ||
      hasNoChanges ||
      isUpdatingFlashcard,
  };

  return (
    <div className="animate-fade-in-right min-h-[80vh] flex flex-col items-center justify-between w-full">
      <div className="w-full">
        <header>
          <h1 className="label">Manage your existing flashcard</h1>
        </header>
        <main className="mx-auto">
          {values?.type === "close_ended" ? (
            <CloseEndedForm
            onSubmit={onSubmit}
              id="close-ended-form/manage"
              closeEndedForm={flashcardForm as UpdateCloseEndedForm}
            />
          ) : (
            <OpenEndedForm
              onSubmit={onSubmit}
              id="open-ended-form/manage"
              openEndedForm={flashcardForm as UpdateOpenEndedForm}
            />
          )}
        </main>
      </div>
      <footer className="flex items-center w-full gap-2">
        <Select onValueChange={handleChangeType} defaultValue={values.type}>
          <SelectTrigger className="my-btn space-x-2 ">
            <Pencil /> <SelectValue defaultValue={values.type} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              <SelectItem defaultChecked value="open_ended">
                Open Ended
              </SelectItem>
              <SelectItem value="close_ended">Close ended</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {values.type === "open_ended" ? (
          <Button {...submitButtonProps} form="open-ended-form/manage">
            Update
          </Button>
        ) : (
          <Button {...submitButtonProps} form="close-ended-form/manage">
            Update
          </Button>
        )}
      </footer>
    </div>
  );
};

export default FlashcardManager;
