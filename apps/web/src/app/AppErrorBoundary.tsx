import { getErrorDetails } from "@/utils/message-extractor.utils";
import React, { type ReactNode, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import { AlertTriangle, X, RefreshCw, Home, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const {
    statusCode,
    message,
    code,
    icon: Icon = AlertTriangle,
    title,
  } = getErrorDetails(error);
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetErrorBoundary, 500);
  };
  const handleGoHome = () => {
    nav("/app");

    setTimeout(() => {
      resetErrorBoundary();
    });
  };

  const handleGoBack = () => {
    if (window.history.length === 0) {
      nav("/app");
      return;
    }
    nav(-1);

    setTimeout(() => {
      resetErrorBoundary();
    });
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ width: 0, height: 0 }}
        animate={{
          width: "100%",
          maxWidth: "420px",
          margin: "auto",
          height: "auto",
          maxHeight: "300px",
        }}
      >
        <div className="bg-zinc-900 border max-w-[420px] border-zinc-800 rounded-2xl shadow-2xl h-full  w-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Icon className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                {statusCode && (
                  <p className="text-sm text-zinc-500">Error {statusCode}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-zinc-400 hover:text-zinc-100 transition-colors p-1 rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-4">
            <p className="text-zinc-300 text-[15px] leading-relaxed">
              {message}
            </p>

            {code && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-400">
                Code: {code}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-zinc-800 grid grid-cols-3 px-6 py-4 flex gap-3">
            <Button
              className="my-btn"
              onClick={handleGoBack}
              variant={"outline"}
            >
              <ChevronLeft className="w-4 h-4" />
              Go Back
            </Button>

            <Button
              className="my-btn w-full"
              variant={"outline"}
              onClick={handleGoHome}
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
            <Button className="my-btn" onClick={handleRetry}>
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AppErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("ErrorBoundary caught an error:", error, info);
        // You can send to error reporting service here (Sentry, etc.)
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
