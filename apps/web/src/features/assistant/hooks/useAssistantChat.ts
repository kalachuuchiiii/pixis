import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import api from "@/lib/api";
import { getErrorMessage } from "@/utils/message-extractor.utils";
import type { Conversation, Message } from "@pixis/schemas";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useCallback, useRef, useState, type ChangeEvent } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type ChatResponse = {
  messages: Message[];
  beforeCursor: number | null;
  afterCursor: number | null;
  nextPage: number | null;
  previousPage: number | null;
};

type PageParam = {
  cursor?: number;
  direction: "next" | "previous";
};

export const useAssistantChat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);

  const clearPdf = () => setPdf(null);
  const handleChangePdf = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdf(file);
    e.target.value = "";
  };

  const queryKey = ["conversation", String(conversationId)];


  const messagesQuery = useInfiniteQuery({
    enabled: !!conversationId,
    queryKey,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: "6",
      });
      const { cursor, direction } = pageParam ?? {
        cursor: undefined,
        direction: "previous",
      };
      if (cursor !== undefined && cursor !== null) {
        params.append(
          direction === "previous" ? "beforeCursor" : "afterCursor",
          cursor.toString()
        );
      }
      const res = await api.get<ChatResponse>(
        `/assistant/conversations/${conversationId}/messages`,
        { params }
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.afterCursor == null) {
        return undefined;
      }
      return {
        cursor: lastPage.afterCursor,
        direction: "next",
      } as PageParam;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.beforeCursor == null) {
        return undefined;
      }
      return {
        cursor: firstPage.beforeCursor,
        direction: "previous",
      } as PageParam;
    },
    staleTime: Infinity,
    initialPageParam: {
      cursor: undefined,
      direction: "previous",
    } as PageParam,
  });
  const { hasNextPage, data } = messagesQuery;
  const messages = data?.pages.flatMap((p) => p?.messages ?? []) ?? [];
  const hasNoMoreData = !hasNextPage && messages.length > 0;
  const hasNoData = !hasNextPage && messages.length === 0;
  const { ref: previousRef } = useInViewRefetch(messagesQuery, {
    direction: "previous",
  });
  const { ref: nextRef } = useInViewRefetch(messagesQuery, {
    direction: "next",
  });
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appendMessage = (message: Message) => {
    queryClient.setQueryData<InfiniteData<ChatResponse, PageParam>>(
      queryKey,
      (oldData) => {
        if (!oldData) {
          return {
            pages: [
              {
                messages: [message],
                beforeCursor: null,
                afterCursor: null,
                nextPage: null,
                previousPage: null,
              },
            ],
            pageParams: [{ cursor: undefined, direction: "previous" }],
          };
        }
        return {
          ...oldData,
          pages: oldData.pages.map((page, i) =>
            i === oldData.pages.length - 1
              ? { ...page, messages: [...page.messages, message] }
              : page
          ),
        };
      }
    );
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const { mutate: sendPrompt, isPending: isSendingPrompt } = useMutation({
    mutationFn: async () => {
      const tempId = Math.floor(Math.random() * 10000);
      appendMessage({
        role: "user",
        content: prompt,
        id: tempId,
        type: "text",
        pdfName: pdf?.name,
      });

      const formData = new FormData();
      formData.append("prompt", prompt);
      if (pdf) {
        formData.append("pdf", pdf);
      }
      setPrompt("");
      setPdf(undefined);
      const res = await api.post<{
        result: {
          response: Message;
          conversation: Conversation;
        };
      }>(`/assistant/chat/${conversationId}`, formData);



      return res.data;
    },
    onSuccess: ({ result: { conversation, response } }) => {
      navigate(`/app/chat/${conversation.id}`, { replace: true });
      appendMessage(response);

    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleChangePrompt = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setPrompt(value);
  };

  return {
    sendPrompt,
    pdf,
    isSendingPrompt,
    prompt,
    handleChangePrompt,
    setPrompt,
    messages,
    clearPdf,
    ...messagesQuery,
    hasNoMoreData,
    containerRef,
    hasNoData,
    handleChangePdf,
    bottomRef,
    previousRef,
    nextRef,
  };
};

export type UseAssistantChatReturn = ReturnType<typeof useAssistantChat>;
