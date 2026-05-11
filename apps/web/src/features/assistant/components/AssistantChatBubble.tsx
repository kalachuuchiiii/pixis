import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Message } from "@pixis/schemas";
import pixis from "/pixis.gif";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Astroid } from "lucide-react";
import { SetPreviewDialog } from "./SetPreviewDialog";
import { motion } from "framer-motion";
import { collapse } from "@/lib/variants";
import { memo } from "react";

export const AssistantChatBubble = memo(
  ({ message }: { message: Message & { role: "assistant" } }) => {
    return (
      <motion.div
        variants={collapse}
        initial="hidden"
        exit="hidden"
        animate="visible"
        className="flex  w-full justify-start "
      >
        <div className="flex  max-w-11/12 lg:max-w-10/12  items-end  gap-2 p-2">
          <img src={pixis} className="size-6" />
          <div className="flex  flex-col gap-2">
            <header className="flex items-center justify-start px-1">
              <div className="flex w-fit gap-2 items-center">
                <label className="text-xs opacity-50"> Pixis</label>
              </div>
            </header>
            <Card className="w-full flex flex-col items-start px-3">
              <CardTitle>{message.content}</CardTitle>
              {message.type === "generate" && (
                <div className="flex flex-col gap-2 mt-4">
                  <label className="opacity-75 gap-2 flex items-center px-1 text-xs">
                    <Astroid className="size-4" /> New set created!
                  </label>
                  <Dialog>
                    <DialogTrigger>
                      <Button className="my-btn cursor-pointer">
                        View set showcase
                      </Button>
                    </DialogTrigger>
                    <SetPreviewDialog messageId={message.id} />
                  </Dialog>
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    );
  }
);
