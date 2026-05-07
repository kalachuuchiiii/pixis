import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import api from "@/lib/api";
import type { ChatMessage } from "@pixis/schemas";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

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
    queryKey: ["conversation", conversationId],
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
      const res = await api.get<{
        messages: ChatMessage[];
        beforeCursor: number | null;
        afterCursor: number | null;
        nextPage: number | null;
        previousPage: number | null;
      }>(`/assistant/conversation/${conversationId}/messages/`, { params });
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

  const appendMessage = (message: ChatMessage) => {
    queryClient.setQueryData(
      ["conversation", conversationId],
      (
        oldData:
          | InfiniteData<
              {
                messages: ChatMessage[];
                nextPage: number | null;
              },
              unknown
            >
          | undefined
      ) => {
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
  };

  const { mutate: sendPrompt, isPending: isSendingPrompt } = useMutation({
    mutationFn: async () => {
      appendMessage({ role: "user", content: prompt, id: 0, type: "text" });

      const res = await api.post<{
        response: {
          response: ChatMessage;
          conversationId: number;
          request: ChatMessage;
        };
      }>(`/assistant/chat/${conversationId}`, {
        prompt,
      });

      return res.data;
    },
    onSuccess: ({ response: { conversationId, response, request } }) => {
      navigate(`/app/chat/${conversationId}`, { replace: true });
      appendMessage(response);
    },
  });

  const handleChangePrompt = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setPrompt(value);
  };

  useLayoutEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
    });
  }, []);

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
