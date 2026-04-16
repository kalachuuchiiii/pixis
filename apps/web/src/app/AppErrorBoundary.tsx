import { getErrorMessage } from "@/utils/message-extractor.utils";
import { isAxiosError } from "axios";
import React, { type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import {
  Lock,
  ShieldAlert,
  FileQuestion,
  ServerCrash,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react"



type ErrorObject = {
  statusCode: number | undefined
  message: string;
  code: string | undefined;
};

const extractErrorObject = (error: unknown): ErrorObject => {
  if (isAxiosError(error)) {
    return {
      statusCode: error.response?.status,
      message: getErrorMessage(error),
      code: error.response?.data.code ?? error.response?.statusText,
    };
  }

  return {
    statusCode: undefined,
    message: getErrorMessage(error),
    code: undefined,
  };
};

const Fallback = ({ error }: FallbackProps) => {
  const { message, code, statusCode } = extractErrorObject(error);
  if (code && statusCode) {
    return (
      <div className="h-screen h-full max-h-screen flex items-center justify-center flex-col">
        <div className="flex items-center gap-5">
           <div className="opacity-75 title text-6xl">
            {statusCode}
           </div>
          <section>
            <h2 className="title text-4xl leading-0">{message}</h2>
            <h3 className="label text-lg leading-0">{code}</h3>
          </section>
        </div>
      </div>
    );
  }
  return <div></div>;
};

const AppErrorBoundary = ({ children }: { children: ReactNode }) => {
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
};

export default AppErrorBoundary;
