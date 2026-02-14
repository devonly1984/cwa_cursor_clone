import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { validateInternalKey } from "../lib/utils";

export const createMessage = mutation({
  args: {
    internalKey: v.string(),
    conversationId: v.id("conversations"),
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    status: v.optional(
      v.union(
        v.literal("processing"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const {
      internalKey,
      conversationId,
      projectId,
      role,
      content,
      status,
    } = args;
    validateInternalKey(internalKey);

    const messageId = await ctx.db.insert("messages", {
      conversationId,
      projectId,
      role,
      content,
      status,
    });
    await ctx.db.patch(conversationId, {
      updatedAt: Date.now(),
    });
    return messageId;
  },
});
export const updateMessageContent = mutation({
  args: {
    internalKey: v.string(),
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { internalKey, messageId, content } = args;
    validateInternalKey(internalKey);
    await ctx.db.patch(messageId, {
      content,
      status: "completed" as const,
    });
  },
});
export const updateMessageStatus = mutation({
  args: {
    internalKey: v.string(),
    messageId: v.id("messages"),
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    await ctx.db.patch(args.messageId, {
      status: args.status,
    });
  },
});
export const updateConversationTitle = mutation({
  args: {
    internalKey: v.string(),
    conversationId: v.id("conversations"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    await ctx.db.patch(args.conversationId, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});
export const updateFile = mutation({
  args: {
    internalKey: v.string(),
    fileId: v.id("files"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }
    await ctx.db.patch(args.fileId, {
      content: args.content,
      updatedAt: Date.now(),
    });
    return args.fileId;
  },
});
export const createFile = mutation({
  args: {
    internalKey: v.string(),
    projectId: v.id("projects"),
    name: v.string(),
    content: v.string(),
    parentId: v.optional(v.id("files")),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )
      .collect();
    const existing = files.find(
      (file) => file.name === args.name && file.type === "file",
    );
    if (existing) {
      throw new Error("File already exists");
    }
    const fileId = await ctx.db.insert("files", {
      projectId: args.projectId,
      name: args.name,
      content: args.content,
      type: "file",
      parentId: args.parentId,
      updatedAt: Date.now(),
    });
    return fileId;
  },
});

export const createFiles = mutation({
  args: {
    internalKey: v.string(),
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    files: v.array(
      v.object({
        name: v.string(),
        content: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    const existingFiles = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )
      .collect();
    const results: { name: string; fileId: string; error?: string }[] = [];
    for (const file of args.files) {
      const existing = existingFiles.find(
        (f) => f.name === file.name && f.type === "file",
      );
      if (existing) {
        results.push({
          name: file.name,
          fileId: existing._id,
          error: "File already exists",
        });
        continue;
      }
      const fileId = await ctx.db.insert("files", {
        projectId: args.projectId,
        name: file.name,
        content: file.content,
        type: "file",
        parentId: args.parentId,
        updatedAt: Date.now(),
      });
      results.push({ name: file.name, fileId });
    }
    return results;
  },
});

export const createFolder = mutation({
  args: {
    internalKey: v.string(),
    projectId: v.id("projects"),
    name: v.string(),

    parentId: v.optional(v.id("files")),
  },
  handler: async (ctx, args) => {
    const { internalKey, parentId, projectId, name } = args;
    validateInternalKey(internalKey);
    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", projectId).eq("parentId", parentId),
      )
      .collect();
    const existing = files.find(
      (file) => file.name === name && file.type === "folder",
    );
    if (existing) {
      throw new Error("Folder already exists");
    }
    const fileId = await ctx.db.insert("files", {
      projectId,
      name,

      type: "folder",
      parentId,
      updatedAt: Date.now(),
    });
    return fileId;
  },
});

export const renameFile = mutation({
  args: {
    internalKey: v.string(),
    fileId: v.id("files"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const { internalKey, fileId, newName } = args;
    validateInternalKey(internalKey);
    const file = await ctx.db.get(fileId);
    if (!file) {
      throw new Error("File not found");
    }
    const siblings = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", file.projectId).eq("parentId", file.parentId),
      )
      .collect();
    const existing = siblings.find(
      (sibling) =>
        sibling.name === newName &&
        sibling.type === file.type &&
        sibling._id === fileId,
    );
    if (existing) {
      throw new Error(`A ${file.type} named ${newName} already exists`);
    }
    await ctx.db.patch(fileId, {
      name: newName,
      updatedAt: Date.now(),
    });
    return fileId;
  },
});
export const deleteFile = mutation({
  args: {
    internalKey: v.string(),
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const { internalKey, fileId } = args;
    validateInternalKey(internalKey);
    const file = await ctx.db.get(fileId);
    if (!file) {
      throw new Error("File not found");
    }
    const deleteRecursive = async (fileId: typeof args.fileId) => {
      const item = await ctx.db.get(fileId);
      if (!item) {
        return;
      }
      if (item.type === "folder") {
        const children = await ctx.db
          .query("files")
          .withIndex("by_project_parent", (q) =>
            q
              .eq("projectId", item.projectId)
              .eq("parentId", item.parentId),
          )
          .collect();
          for (const child of children) {
            await deleteRecursive(child._id)
          }
      }
      if (item.storageId) {
        await ctx.storage.delete(item.storageId)
      }
      await ctx.db.delete(fileId);

    };
    await deleteRecursive(fileId);
    return fileId;
  },
});
