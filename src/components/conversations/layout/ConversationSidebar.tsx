import { Id } from "../../../../convex/_generated/dataModel"
import ky from "ky";
import { toast } from "sonner";
import { useState } from "react";
import { Copy, History, Loader, Plus } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import {
  useConversation,
  useConversations,
  useCreateConversation,
  useMessages,
} from "@/components/conversations/hooks/useConservations";
import { DEFAULT_CONVERSATION_TITLE } from "../../../../convex/lib/constants";
interface ConversationSidebarProps {
    projectId: Id<'projects'>;
}
const ConversationSidebar = ({ projectId }: ConversationSidebarProps) => {
  const [input, setInput] = useState("");

  const createConversation = useCreateConversation();
  const [selectedConversationId, setSelectedConversationId] =
    useState<Id<"conversations"> | null>(null);
    const conversations = useConversations(projectId);
    const activeConversationId =
      selectedConversationId ?? conversations?.[0]?._id ?? null;
    const activeConversation = useConversation(activeConversationId)
    const conversationMessages = useMessages(activeConversationId);

    //Is Processing
    const isProcessing = conversationMessages?.some(
      (msg) => msg.status === "processing",
    );
    const handleSubmit = async(message:PromptInputMessage)=>{
      //if processing and no new message , stop function
      if (isProcessing && !message.text) {
        //await handleCancel
        setInput("");
      }
      let conversationId = activeConversationId;
      if (!conversationId) {
        conversationId = await handleCreateConversation();
        if (!conversationId) {
          return;
        }
      }
      try {
        await ky.post("/api/messages", {
          json: {
            conversationId,
            message: message.text,
          },
        });        
      } catch (error) {
        toast.error("Message failed to send")
      }

    }
    const handleCreateConversation = async()=>{
      try {
        const newConversationId = await createConversation({
          projectId,
          title: DEFAULT_CONVERSATION_TITLE,
        });
        setSelectedConversationId(newConversationId);
        return newConversationId;
      } catch (error) {
          toast.error("Unable to create new conversation");
          return null;
      }
    }

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="h-8 75 flex items-center justify-between border-b">
        <div className="text-sm truncate pl-3">
          {activeConversation?.title ?? DEFAULT_CONVERSATION_TITLE}
        </div>
        <div className="flex items-center px-1 gap-1">
          <Button size="icon-xs" variant={"highlight"}>
            <History className="size-3.5" />
          </Button>
          <Button
            size="icon-xs"
            variant={"highlight"}
            onClick={handleCreateConversation}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>
      <Conversation className="flex-1">
        <ConversationContent>
          {conversationMessages?.map((messages, msgIndex) => (
            <Message key={messages?._id} from={messages.role}>
              <MessageContent>
                {messages.status === "processing" ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader className="size-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <MessageResponse>{messages.content}</MessageResponse>
                )}
              </MessageContent>
              {messages.role === "assistant" &&
                messages.status === "completed" &&
                msgIndex === (conversationMessages?.length ?? 0) - 1 && (
                  <MessageActions>
                    <MessageAction
                      onClick={() =>
                        navigator.clipboard.writeText(messages.content)
                      }
                      label="Copy"
                    >
                      <Copy className="size-3" />
                    </MessageAction>
                  </MessageActions>
                )}
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="p-3">
        <PromptInput onSubmit={handleSubmit} className="mt-2 rounded-full!">
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask Polaris anything..."
              onChange={(e) => setInput(e.target.value)}
              value={input}
              disabled={isProcessing}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit
              disabled={isProcessing ? false : !input}
              status={isProcessing ? "streaming" : undefined}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
export default ConversationSidebar