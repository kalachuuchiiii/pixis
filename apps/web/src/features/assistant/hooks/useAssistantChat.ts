import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import api from "@/lib/api";
import { getErrorMessage } from "@/utils/message-extractor.utils";
import type { Message } from "@pixis/schemas";
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

  const messagesQuery = useInfiniteQuery({
    queryKey: ["conversation", String(conversationId)],
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
        `/assistant/conversations/${conversationId}/messages/`,
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

  const appendMessage = useCallback(
    (message: Message) => {
      queryClient.setQueryData(
        ["conversation", conversationId],
        (oldData: InfiniteData<ChatResponse, unknown> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any, i: number) => {
              if (i === oldData.pages.length - 1) {
                return {
                  ...page,
                  messages: [...page.messages, message],
                };
              }
              return page;
            }),
          };
        }
      );
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    },
    [conversationId]
  );

  const { mutate: sendPrompt, isPending: isSendingPrompt } = useMutation({
    mutationFn: async () => {
      const tempId = Math.floor(Math.random() * 10000);
      appendMessage({
        role: "user",
        content: prompt,
        id: tempId,
        type: "text",
      });
      setPrompt("");
      const res = await api.post<{
        result: {
          response: Message;
          conversationId: number;
        };
      }>(`/assistant/chat/${conversationId}`, {
        prompt,
      });

      return res.data;
    },
    onSuccess: ({ result: { conversationId, response } }) => {
      navigate(`/app/chat/${conversationId}`, { replace: true });
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
    isSendingPrompt,
    prompt,
    handleChangePrompt,
    setPrompt,
    messages,
    ...messagesQuery,
    hasNoMoreData,
    containerRef,
    hasNoData,
    bottomRef,
    previousRef,
    nextRef,
  };
};

export type UseAssistantChatReturn = ReturnType<typeof useAssistantChat>;
