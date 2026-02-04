import { v } from "convex/values";
import { query } from "../../_generated/server";
import { validateInternalKey } from "../lib/utils";

export const getConversationById = query({
    args: {
        conversationId: v.id('conversations'),
        internalKey: v.string()
    },
    handler: async(ctx,args)=>{
        validateInternalKey(args.internalKey)
        return await ctx.db.get(args.conversationId)
    }
})