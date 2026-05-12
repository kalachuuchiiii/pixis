import { useAssistantChat } from "../hooks/useAssistantChat";
import { PromptInput } from "../components/PromptInput";
import { AssistantChatBubble } from "../components/AssistantChatBubble";
import { UserChatBubble } from "../components/UserChatBubble";

import { Spinner } from "@/components/ui/spinner";
import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { AnimatePresence, motion } from "framer-motion";
import { collapse } from "@/lib/variants";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { DynamicBackground } from "@/components/ui/DynamicBackground";

const AssistantPage = () => {
  const { data: user } = useAuthUser();
  const assistantChat = useAssistantChat();
  const {
    isSendingPrompt,
    bottomRef,

    messages,
    previousRef,
    nextRef,
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
    <div className="relative w-full max-w-7xl">
      <DynamicBackground />
      {messages.reverse().length > 0 ? (
        <div>
          <div
            ref={containerRef}
            className=" flex flex-col  flex-col-reverse h-[70vh] overflow-y-auto px-2 py-6 lg:px-2 lg:p-2"
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
            {messages.map(({ role, type, content, id }) =>
              role === "assistant" ? (
                <AssistantChatBubble
                  message={{ role, content, type, id }}
                  key={id}
                />
              ) : (
                <UserChatBubble
                  message={{ role, content, type, id }}
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
            <header className="text-center space-y-3 mt-40  ">
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
  );
};

export default AssistantPage;
