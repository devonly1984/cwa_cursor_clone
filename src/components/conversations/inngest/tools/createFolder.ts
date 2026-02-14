import { createTool } from "@inngest/agent-kit";
import { api } from "../../../../../convex/_generated/api";
import { convexClient } from "@/lib/convex/convexClient";

import z from "zod";
import { Id } from "../../../../../convex/_generated/dataModel";
import { createFolderParamSchema } from "@/lib/schemas/agentKit/tools/createFolderParamSchema";

interface CreateFolderToolOptions {
  projectId: Id<"projects">;
  internalKey: string;
}

export const createCreateFolderTool = ({
  internalKey,
  projectId,
}: CreateFolderToolOptions) => {
  return createTool({
    name: "createFolder",
    description: "Create a new folder in the project",
    parameters: z.object({
     name: z.string().describe("The name of the folder to create"),
      parentId: z.string().describe("The ID (not name!) of the parent folder from listFiles, or empty string for root level")
    }),
    handler: async (params, { step: toolStep }) => {
      const parsed = createFolderParamSchema.safeParse(params);
      if (!parsed.success) {
        return `Error: ${parsed.error.issues[0].message}`;
      }
      const { parentId, name } = parsed.data;

      try {
        return await toolStep?.run("create-folder", async () => {
       
          if (parentId) {
            try {
            
              const parentFolder = await convexClient.query(
                api.system.queries.conversations.getFileById,
                {
                  internalKey,
                  fileId: parentId as Id<'files'>,
                },
              );
              if (!parentFolder) {
                return `Error: Parent folder with ID "${parentId}" not found. use listFiles to get valid folder IDs.`;
              }
              if (parentFolder.type !== "folder") {
                return `Error: The ID "${parentId}" is a file, not a folder. Use a folder ID as parentId.`;
              }
            } catch {
              return `Error: Invalid parentId "${parentId}". Use listFiles to get valid folder IDs, or use empty string for root level.`;
            }
          }
          const folderId = await convexClient.mutation(api.system.mutations.conversations.createFolder,{
            internalKey,
            projectId,
            name,
            parentId: parentId ? (parentId as Id<'files'>):undefined
          })

        
          return `Folder created with ID: ${folderId}`;
        });
      } catch (error) {
        return `Error creating folder: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
};
