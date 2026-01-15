import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { verifyAuth } from "../lib/utils";

export const getPartial = query({
    args: {
        limit: v.number()
    },
    handler: async(ctx,args)=>{
        const identity = await verifyAuth(ctx);
        if (!identity) {
            return []
        }
        return await ctx.db.query("projects").withIndex('by_owner', q => q.eq('ownerId', identity.subject)).take(args.limit)

    }
})
export const get = query({
    args: {
        
    },
    handler: async(ctx,args)=>{
        const identity = await verifyAuth(ctx);
        if (!identity) {
            return []
        }
        return  ctx.db.query("projects").withIndex('by_owner', q => q.eq('ownerId', identity.subject)).collect()

    }
})