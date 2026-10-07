import { useAssistantChat } from "../hooks/useAssistantChat";
import { PromptInput } from "../components/PromptInput";
import { AssistantChatBubble } from "../components/AssistantChatBubble";
import { UserChatBubble } from "../components/UserChatBubble";

import { Spinner } from "@/components/ui/spinner";
import { AnimatePresence, motion } from "framer-motion";
import { collapse } from "@/lib/variants";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { DynamicBackground } from "@/components/ui/DynamicBackground";

const AssistantPage = () => {
  const { data: user } = useAuthUser();
  const assistantChat = useAssistantChat();
  const {
    bottomRef,
    messages,
    previousRef,
    nextRef,
    isSendingPrompt,
    isFetchingNextPage,
    isFetchingPreviousPage,
    containerRef,
    isLoading,
  } = assistantChat;

  if (isLoading) {
    return (
      <div className="w-full h-screen  flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden h-[80vh] w-full  max-w-7xl">
      <div className="flex h-full w-full flex-col-reverse overflow-y-scroll">
        <DynamicBackground />
        {messages.length > 0 || isSendingPrompt ? (
          <div className="py-10">
            <div
              ref={containerRef}
              className=" flex  flex-col-reverse overflow-scroll h-max lg:px-2 py-6"
            >
              <div ref={bottomRef} className="p-2" />
              <div ref={nextRef} />
              <AnimatePresence>
                {isFetchingNextPage && (
                  <motion.p
                    variants={collapse}
                    initial="hidden"
                    exit="hidden"
                    animate="visible"
                    className="opacity-75 font-medium text-center w-full"
                  >
                    Loading new messages...
                  </motion.p>
                )}
              </AnimatePresence>
              {messages
                .reverse()
                .map(({ role, type, content, id, pdfName }) =>
                  role === "assistant" ? (
                    <AssistantChatBubble
                      message={{ role, content, type, pdfName, id }}
                      key={id}
                    />
                  ) : (
                    <UserChatBubble
                      message={{ role, content, type, id, pdfName }}
                      key={id}
                    />
                  )
                )}{" "}
              {isFetchingPreviousPage && (
                <p className="py-8 text-center w-full opacity-75 font-medium">
                  Loading messages...
                </p>
              )}
              <div ref={previousRef} />
            </div>
          </div>
        ) : (
          <div>
            <div className="w-full relative">
              {/* Header */}
              <header className="text-center space-y-3 mb-70  ">
                <h1 className="text-6xl font-bold tracking-tighter ">
                  Hello, {user.nickname || user.username}!
                </h1>
                <p className="text-xl text-muted-foreground font-light">
                  How can I help you today?
                </p>
              </header>
            </div>
          </div>
        )}

        <PromptInput {...assistantChat} />
      </div>
    </div>
  );
};

export default AssistantPage;
