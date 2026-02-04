import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    projectId: v.id('projects'),
    title: v.string(),
    updatedAt: v.number(),

}).index('by_project',[
    'projectId'
])