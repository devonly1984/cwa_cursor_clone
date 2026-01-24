import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  projectId: v.id("projects"),
  parentId: v.optional(v.id("files")),
  name: v.string(),
  type: v.union(v.literal("file"), v.literal("folder")),
  content: v.optional(v.string()), //Text files only
  storageId: v.optional(v.id("_storage")), //Binary Files
  updatedAt: v.number(),
})
  .index("by_project", ["projectId"])
  .index("by_parent", ["parentId"])
  .index("by_project_parent", ["projectId", "parentId"]);
