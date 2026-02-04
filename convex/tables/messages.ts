import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
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
 
})
  .index("by_conversation", ["conversationId"])
  .index("by_project_status", ["projectId", "status"]);
