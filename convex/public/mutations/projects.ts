import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { verifyAuth } from "../lib/utils";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      ownerId: identity.subject,
      updatedAt: Date.now(),
    });
    return projectId;
  },
});
export const rename = mutation({
  args: {
    id: v.id("projects"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    if (!identity) {
      return [];
    }
    const project = await ctx.db.get("projects", args.id);
    if (!project) {
      throw new Error("Project Not Found");
    }
    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project");
    }
    await ctx.db.patch("projects", args.id, {
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});

export const updateSettings = mutation({
  args: {
    id: v.id("projects"),
    settings: v.object({
      installCommand: v.optional(v.string()),
      devCommand: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { id, settings } = args;
    const identity = await verifyAuth(ctx);
    const project = await ctx.db.get("projects", id);

    if (!project) {
      throw new Error("Project not found");
    }
    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized to update this project");
    }
    await ctx.db.patch("projects", id, {
      settings,
      updatedAt: Date.now(),
    });
  },
});
