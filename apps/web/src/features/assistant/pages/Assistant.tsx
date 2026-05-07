import { useProfileDetails } from "@/features/account/hooks/useProfileDetails.ts";
import { useAssistantChat } from "../hooks/useAssistantChat";
import { PromptInput } from "../components/PromptInput";
import { AssistantChatBubble } from "../components/AssistantChatBubble";
import { UserChatBubble } from "../components/UserChatBubble";
import { useEffect, useRef } from "react";

const AssistantPage = () => {
  const { data: user } = useProfileDetails();
  const assistantChat = useAssistantChat();
  const {
    sendPrompt,
    isSendingPrompt,
    bottomRef,
    prompt,
    setPrompt,
    messages,
    previousRef,
    nextRef,
    containerRef,
  } = assistantChat;

  return (
    <div>
      {messages.length > 0 ? (
        <div>
          <div
            ref={containerRef}
            className="h-[70vh]  flex flex-col flex flex flex-col-reverse overflow-y-auto p-2"
          >
            {" "}
            <div ref={nextRef} />
            <div ref={bottomRef} />
            {messages
              .reverse()
              .map(({ role, type, content, id }) =>
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
            <div ref={previousRef} />
          </div>

          <PromptInput {...assistantChat} />
        </div>
      ) : (
        <div className="page-container h-screen ">
          <div className="w-full h-full flex flex-col items-center justify-start  gap-16 px-6">
            {/* Header */}
            <header className="text-center space-y-3 mt-30">
              <h1 className="text-6xl font-bold tracking-tighter ">
                Hello, {user.nickname || user.username}!
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                How can I help you today?
              </p>
            </header>

            {/* Input Area */}
            <PromptInput {...assistantChat} />

            <p className="text-xs text-muted-foreground/70 text-center">
              Pixis AI • Always learning
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantPage;
