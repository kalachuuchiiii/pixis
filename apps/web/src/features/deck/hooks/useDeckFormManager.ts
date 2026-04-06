import {
  topicSchema,
  visibilitySchema,
  type Deck,
  type RawDeckForm,
} from "@pixis/schemas";
import type { ChangeEvent } from "react";

export const useDeckFormManager = <T extends Deck | RawDeckForm>(
  setState: React.Dispatch<React.SetStateAction<T>>
) => {
  const handleChangeDeckForm = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target; //title desc or color
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeVisibility = (val: string) => {
    const { data: visibility, error } = visibilitySchema.safeParse(val);
    if (error) return;
    setState((prev) => ({
      ...prev,
      visibility,
    }));
  };

  const addTopic = (val: string) => {
    const { data: topic, error } = topicSchema.safeParse(val);
    if (error) return;
    setState((prev) => ({
      ...prev,
      topic,
    }));
  };

  return {
    handleChangeDeckForm,
    addTopic,
    handleChangeVisibility,
  };
};
