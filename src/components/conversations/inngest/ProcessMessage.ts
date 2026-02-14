import { InngestClient } from "@/lib/inngest/client";
import { Id } from "../../../../convex/_generated/dataModel";
import { NonRetriableError } from "inngest";
import { convexClient } from "@/lib/convex/convexClient";
import { api } from "../../../../convex/_generated/api";
import {
  CODING_AGENT_SYSTEM_PROMPT,
  TITLE_GENERATOR_SYSTEM_PROMPT,
} from "./constants";
import { DEFAULT_CONVERSATION_TITLE } from "../../../../convex/public/lib/constants";
import { createAgent, createNetwork, gemini } from "@inngest/agent-kit";
import {
  createCreateFilesTool,
  createCreateFolderTool,
  createListFilesTool,
  createReadFilesTool,
  createUpdateFilesTool,
  createRenameFilesTool,
  createDeleteFilesTool,
  createScrapeUrlsTool,
} from "./tools";
interface MessageEvent {
  messageId: Id<"messages">;
  conversationId: Id<"conversations">;
  projectId: Id<"projects">;
  message: string;
}
export const processMessage = InngestClient.createFunction(
  {
    id: "process-message",
    cancelOn: [
      {
        event: "message/cancel",
        if: "event.data.messageId == async.data.messageId",
      },
    ],
    onFailure: async ({ event, step }) => {
      const { messageId } = event.data.event.data as MessageEvent;
      const internalKey = process.env.CONVEX_INTERNAL_KEY;

      if (internalKey) {
        await step.run("update-message-on-failure", async () => {
          await convexClient.mutation(
            api.system.mutations.conversations.updateMessageContent,
            {
              internalKey,
              messageId,
              content:
                "My apologies, I encountered an error while processing your request. Let me know if you need anything else!",
            },
          );
        });
      }
    },
  },
  {
    event: "message/sent",
  },
  async ({ event, step }) => {
    const { messageId, conversationId, projectId, message } =
      event.data as MessageEvent;
    const internalKey = process.env.CONVEX_INTERNAL_KEY;
    if (!internalKey) {
      throw new NonRetriableError("CONVEX_INTERNAL_KEY is not configured");
    }
    await step.sleep("wait-for-db-sync", "5s");

    const conversation = await step.run("get-conversation", async () => {
      return await convexClient.query(
        api.system.queries.conversations.getConversationById,
        {
          internalKey,
          conversationId,
        },
      );
    });
    if (!conversation) {
      throw new NonRetriableError("Conversation not found");
    }
    const recentMessages = await step.run(
      "getting-recent-messages",
      async () => {
        return await convexClient.query(
          api.system.queries.conversations.getRecentMessages,
          {
            internalKey,
            conversationId,
            limit: 10,
          },
        );
      },
    );
    //Build system prompt with conversation history (exclude the current processing message)
    let systemPrompt = CODING_AGENT_SYSTEM_PROMPT;

    //filter out current processing messages
    const contextMessages = recentMessages.filter(
      (msg) => msg._id !== messageId && msg.content.trim() !== "",
    );
    if (contextMessages.length > 0) {
      const historyText = contextMessages
        .map((msg) => `${msg.role.toUpperCase()}:${msg.content}`)
        .join("\n\n");

      systemPrompt += `\n\n## Previous Conversation (for context only - do NOT repeat these responses):\n${historyText}\n\n## Current Request:\nRespond ONLY to the user's new message below. Do not repeat or reference your previous responses.`;
    }
    //Generate conversation title if it's still the title
    const shouldGenerate =
      conversation.title === DEFAULT_CONVERSATION_TITLE;

    if (shouldGenerate) {
      const titleAgent = createAgent({
        name: "title-generator",
        system: TITLE_GENERATOR_SYSTEM_PROMPT,
        model: gemini({
          model: "gemini-1.5-flash",
          defaultParameters: {},
        }),
      });
      const { output } = await titleAgent.run(message, { step });
      const textMessage = output.find(
        (m) => m.type === "text" && m.role === "assistant",
      );
      if (textMessage?.type === "text") {
        const title =
          typeof textMessage.content === "string"
            ? textMessage.content.trim()
            : textMessage.content
                .map((c) => c.text)
                .join("")
                .trim();
        if (title) {
          await step.run("update-conversation-title", async () => {
            await convexClient.mutation(
              api.system.mutations.conversations.updateConversationTitle,
              {
                internalKey,
                conversationId,
                title,
              },
            );
          });
        }
      }
    }

    //create the coding agent with file tools

    const codingAgent = createAgent({
      name: "polaris",
      description: "An expert AI coding assistant",
      system: systemPrompt,
      model: gemini({
        model: "gemini-1.5-flash",
      }),
      tools: [
        createListFilesTool({ internalKey, projectId }),
        createReadFilesTool({ internalKey }),
        createUpdateFilesTool({ internalKey }),
        createCreateFilesTool({ internalKey, projectId }),
        createCreateFolderTool({ internalKey, projectId }),
        createRenameFilesTool({ internalKey }),
        createDeleteFilesTool({ internalKey }),
        createScrapeUrlsTool()
      ],
    });

    //Create network with a single agent
    const network = createNetwork({
      name: "polaris-network",
      agents: [codingAgent],
      maxIter: 20,
      router: ({ network }) => {
        const lastResult = network.state.results.at(-1);
        const hasTextResponse = lastResult?.output.some(
          (m) => m.type === "text" && m.role === "assistant",
        );
        const hasToolCalls = lastResult?.output.some(
          (m) => m.type === "tool_call",
        );
        if (hasTextResponse && !hasToolCalls) {
          return undefined;
        }
        return codingAgent;
      },
    });
    //Run the agent
    const result = await network.run(message);
    // Extract the assistant's text response from teh last agent result
    const lastResult = result.state.results.at(-1);
    const textMessage = lastResult?.output.find(
      (m) => m.type === "text" && m.role === "assistant",
    );
    let assistantResponse =
      "I processed your request. Let me know if you need anything else!";

    if (textMessage?.type === "text") {
      assistantResponse =
        typeof textMessage.content === "string"
          ? textMessage.content
          : textMessage.content.map((c) => c.text).join("");
    }

    await step.run("update-assistant-message", async () => {
      await convexClient.mutation(
        api.system.mutations.conversations.updateMessageContent,
        {
          internalKey,
          messageId,
          content: assistantResponse,
        },
      );
    });
    return { success: true, messageId, conversationId };
  },
);
