import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { validateInternalKey } from "../lib/utils";

export const createMessage  = mutation({
    args: {
        internalKey: v.string(),
        conversationId: v.id('conversations'),
        projectId: v.id('projects'),
        role: v.union(v.literal('user'),v.literal('assistant')),
        content: v.string(),
        status: v.optional(
            v.union(
                v.literal('processing'),
                v.literal('completed'),
                v.literal('cancelled')
            )
        )
    },
    handler: async(ctx,args)=>{
        const {internalKey,conversationId,projectId,role,content,status} = args;
        validateInternalKey(internalKey);

        const messageId = await ctx.db.insert('messages',{
            conversationId,
            projectId,
            role,
            content,
            status,
        })
        await ctx.db.patch(conversationId,{
            updatedAt: Date.now()
        })
        return messageId;
    }
})
export const updateMessageContent = mutation({
    args: {
        internalKey: v.string(),
        messageId: v.id('messages'),
        content: v.string()
    },
    handler: async(ctx,args)=>{
        const {internalKey,messageId,content}= args;
        validateInternalKey(internalKey)
        await ctx.db.patch(messageId,{
            content,
            status: 'completed' as const
        })
    }
})