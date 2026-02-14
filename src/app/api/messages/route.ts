import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { messageRequestSchema } from "@/lib/schemas/messages";
import { convexClient } from "@/lib/convex/convexClient";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { InngestClient } from "@/lib/inngest/client";

export const POST = async (request: Response) => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const internalKey = process.env.CONVEX_INTERNAL_KEY;
  if (!internalKey) {
    return NextResponse.json(
      { error: "Internal key not configured" },
      { status: 500 },
    );
  }
  const body = await request.json();
  const { conversationId, message } = messageRequestSchema.parse(body);
  const conversation = await convexClient.query(
    api.system.queries.conversations.getConversationById,
    {
      internalKey,
      conversationId: conversationId as Id<"conversations">,
    },
  );
  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 },
    );
  }
  const projectId = conversation.projectId;

  const processingMessages = await convexClient.query(
    api.system.queries.conversations.getProcessingMessages,
    {
      internalKey,
      projectId,
    },
  );
  if (processingMessages.length > 0) {
    await Promise.all(
      processingMessages.map(async (msg) => {
        await InngestClient.send({
          name: "message/cancel",
          data: {
            messageId: msg._id,
          },
        });
        await convexClient.mutation(
          api.system.mutations.conversations.updateMessageStatus,
          {
            internalKey,
            messageId: msg._id,
            status: "cancelled",
          },
        );
      }),
    );
  }

  await convexClient.mutation(
    api.system.mutations.conversations.createMessage,
    {
      internalKey,
      conversationId: conversationId as Id<"conversations">,
      projectId,
      role: "user",
      content: message,
    },
  );
  const assistantMessageId = await convexClient.mutation(
    api.system.mutations.conversations.createMessage,
    {
      internalKey,
      conversationId: conversationId as Id<"conversations">,
      projectId,
      role: "assistant",
      content: "",
      status: "processing",
    },
  );
  //Processed the messages
  const event = await InngestClient.send({
    name: "message/sent",
    data: {
      messageId: assistantMessageId,
      conversationId,
      projectId,
        message
    },
  });
  return NextResponse.json({
    success: true,
    eventId: event.ids[0],
    messageId: assistantMessageId,
  });
};
