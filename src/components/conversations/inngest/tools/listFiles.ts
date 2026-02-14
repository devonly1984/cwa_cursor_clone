import { createTool } from "@inngest/agent-kit";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import z from "zod";
import { convexClient } from "@/lib/convex/convexClient";

interface ListFilesToolOptions {
  projectId: Id<"projects">;
  internalKey: string;
}

export const createListFilesTool = ({
  projectId,
  internalKey,
}: ListFilesToolOptions) => {
  return createTool({
    name: "listFiles",
    description:
      "List all files and folders in the project. Returns names, IDs, types and parentID for each item. Items with parentId: null are at root level. Use the parentId to understand the folder structure - items with the same parentId are in the same folder",
    parameters: z.object({}),
    handler: async (_, { step: toolStep }) => {
      try {
        return await toolStep?.run("list-files", async () => {
          const files = await convexClient.query(
            api.system.queries.conversations.getProjectFiles,
            {
              internalKey,
              projectId,
            },
          );

          //sort: folders first, then files alpha
          const sorted = files.sort((a, b) => {
            if (a.type === "folder" && b.type === "file") return -1;
            if (a.type === "file" && b.type === "folder") return 1;
            return a.name.localeCompare(b.name);
          });
          const fileList = sorted.map((f) => ({
            id: f._id,
            name: f.name,
            type: f.type,
            parentId: f.parentId ?? null,
          }));
          return JSON.stringify(fileList);
        });
      } catch (error) {
        return `Error listing files: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
};
