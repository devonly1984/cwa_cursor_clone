import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { verifyAuth } from "../lib/utils";

export const getPartial = query({
  args: {
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    if (!identity) {
      return [];
    }
    return await ctx.db
      .query("projects")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject)).order('desc')
      .take(args.limit);
  },
});
export const get = query({
  args: {},
  handler: async (ctx, ) => {
    const identity = await verifyAuth(ctx);
    if (!identity) {
      return [];
    }
    return ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
      .order("desc")
      .collect();
  },
});
export const getById = query({
  args: {
    id: v.id('projects')
  },
  handler: async(ctx,args)=>{
      const identity = await verifyAuth(ctx);
  
    const project = await ctx.db.get('projects', args.id)
   if (!project) {
     throw new Error("Project Not Found")
   }
   if (project.ownerId !==identity.subject) {
     throw new Error("Unauthorized access to this project")
   }
    return project;   
  }
})
