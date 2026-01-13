import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const create  = mutation({
    args: {
        name: v.string()
    },
    handler: async(ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized")
        }
        return await ctx.db.insert("projects", {
          name: args.name,
            ownerId: identity.subject,
        });
    }
})