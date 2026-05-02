import { FlashcardCreator } from "../components/FlashcardCreator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { type Flashcard } from "@pixis/schemas";
import api from "@/lib/api";
import {
  CloseEndedFlashcard,
  OpenEndedFlashcard,
} from "../components/MyFlashcard";

import { FlashcardFilter } from "../components/FlashcardFilter";
import { useFlashcardFilter } from "../hooks/useFlashcardFilter";
import { createContext, useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import { AppHeader } from "@/components/ui/AppHeader";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useFlashcardList } from "../hooks/useDeckFlashcards";

export const FlashcardListContext = createContext<{
  queryKey: string[];
} | null>(null);

const FlashcardList = () => {

  return (
    <>
      <div className="page-container">
        <div className="flex items-end justify-between">
        
        </div>

      
      
      </div>
    </>
  );
};

export default FlashcardList;
