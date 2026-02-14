import { createTool } from "@inngest/agent-kit";
import { api } from "../../../../../convex/_generated/api";
import { convexClient } from "@/lib/convex/convexClient";

import z from "zod";
import { Id } from "../../../../../convex/_generated/dataModel";
import { renameFileParamSchema } from "@/lib/schemas/agentKit/tools/renameFileParamSchema";

interface RenameFilesToolOptions {
  internalKey: string;
}

export const createRenameFilesTool = ({
  internalKey,
}: RenameFilesToolOptions) => {
  return createTool({
    name: "renameFile",
    description: "Rename a file or folder",
    parameters: z.object({
          fileId: z.string().describe("The ID of the file or folder to rename"),
      newName: z.string().describe("The new name for the file or folder")
    }),
    handler: async (params, { step: toolStep }) => {
      const parsed = renameFileParamSchema.safeParse(params);
      if (!parsed.success) {
        return `Error: ${parsed.error.issues[0].message}`;
      }
      const { fileId, newName } = parsed.data;

      const file = await convexClient.query(
        api.system.queries.conversations.getFileById,
        {
          internalKey,
          fileId: fileId as Id<"files">,
        },
      );

      if (!file) {
        return `Error: File with ID "${fileId}" not found. Use listFiles to get valid file IDs.`;
      }
    
      try {
        return await toolStep?.run("rename-file", async () => {
          await convexClient.mutation(
            api.system.mutations.conversations.renameFile,
            {
              internalKey,
              fileId: fileId as Id<"files">,
              newName,
            },
          );
          return `Renamed "${file.name}"  to "${newName}" successfully`
        });
      } catch (error) {
        return `Error updating file: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
};
