import { createTool } from "@inngest/agent-kit";
import { api } from "../../../../../convex/_generated/api";
import { convexClient } from "@/lib/convex/convexClient";

import z from "zod";
import { updateFileParamsSchema } from "@/lib/schemas/agentKit/tools/updateFilesParamSchema";
import { Id } from "../../../../../convex/_generated/dataModel";

interface UpdateFilesToolOptions {
  internalKey: string;
}

export const createUpdateFilesTool = ({
  internalKey,
}: UpdateFilesToolOptions) => {
  return createTool({
    name: "updateFile",
    description: "Update the content of an existing file",
    parameters: z.object({
      fileId: z.string().describe("The ID of the file to update"),
      content: z.string().describe("The new content for the file"),
    }),
    handler: async (params, { step: toolStep }) => {
      const parsed = updateFileParamsSchema.safeParse(params);
      if (!parsed.success) {
        return `Error: ${parsed.error.issues[0].message}`;
      }
      const { fileId, content } = parsed.data;

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
      if (file.type === "folder") {
        return `Error: "${fileId}" is a folder, not a file. You can only update file contents.`;
      }

      try {
        return await toolStep?.run("update-file", async () => {
          await convexClient.mutation(
            api.system.mutations.conversations.updateFile,
            {
              internalKey,
              fileId: fileId as Id<"files">,
              content,
            },
          );
          return `File "${file.name}" updated successfully`
        });
      } catch (error) {
        return `Error updating file: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
};
