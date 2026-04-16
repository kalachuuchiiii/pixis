import { isAxiosError } from "axios";
import z from "zod";

export const getErrorMessage = (err: unknown) => {
  if (!navigator.onLine) {
    return "Please check your internet and try again.";
  }
  if (isAxiosError(err)) {
    return err.response?.data.message ?? err.response?.statusText ?? "Something unexpected has occured.";
  }
  if (err instanceof z.ZodError) {
    return err.issues[0].message ?? "Something unexpected has occured.";
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Internal Server Error";
};

export const getSuccessMessage = (res: any) => {
  console.log(res, 'succ');
  if (!navigator.onLine) {
    return "Please check your internet and try again.";
  }
  return res?.response?.data?.message ?? res?.data?.message ?? res?.message ?? 'Success'
};
