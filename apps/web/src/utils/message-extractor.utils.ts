import { isAxiosError } from "axios";
import {
  AlertTriangle,
  FileQuestion,
  Lock,
  ServerCrash,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import z from "zod";
export type ErrorObject = {
  statusCode?: number;
  message: string;
  code?: string;
  icon?: LucideIcon;
  title?: string;
};

export const getErrorDetails = (error: unknown): ErrorObject => {
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    const message = getErrorMessage(error);
    const code = error.response?.data?.code ?? error.response?.statusText;

    let icon: LucideIcon = AlertTriangle;
    let title = "Something went wrong";

    if (statusCode === 401 || statusCode === 403) {
      icon = Lock;
      title = statusCode === 401 ? "Session Expired" : "Access Denied";
    } else if (statusCode === 404) {
      icon = FileQuestion;
      title = "Not Found";
    } else if (statusCode && statusCode >= 500) {
      icon = ServerCrash;
      title = "Server Error";
    } else if (statusCode === 429) {
      title = "Too Many Requests";
    }

    return { statusCode, message, code, icon, title };
  }

  return {
    message: getErrorMessage(error) || "An unexpected error occurred",
    icon: ShieldAlert,
    title: "Unexpected Error",
  };
};

export const getErrorMessage = (err: unknown): string => {
  if (isAxiosError(err)) {
    return (
      err.response?.data.message ??
      err.response?.statusText ??
      "Something unexpected has occured."
    );
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
  return (
    res?.response?.data?.message ??
    res?.data?.message ??
    res?.message ??
    "Success"
  );
};
