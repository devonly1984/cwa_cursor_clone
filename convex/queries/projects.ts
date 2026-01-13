import { ConvexError } from "convex/values";
import { query } from "../_generated/server";

export const get = query({
    args: {},
    handler: async(ctx)=>{
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return []
        }
        return await ctx.db.query("projects").withIndex('by_owner', q => q.eq('ownerId', identity.subject)).collect();
    }
})