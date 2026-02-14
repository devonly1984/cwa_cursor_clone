import { createTool } from "@inngest/agent-kit";
import { api } from "../../../../../convex/_generated/api";
import { convexClient } from "@/lib/convex/convexClient";

import z from "zod";
import { Id } from "../../../../../convex/_generated/dataModel";
import { deleteFileParamSchema } from "@/lib/schemas/agentKit/tools/deleteFileParamSchema copy";

interface DeleteFilesToolOptions {
  internalKey: string;
}

export const createDeleteFilesTool = ({
  internalKey,
}: DeleteFilesToolOptions) => {
  return createTool({
    name: "deleteFiles",
    description:
      "Delete files or folders from the project. If deleting a folder, all contents will be deleted recursively. ",
    parameters: z.object({
      fileIds: z
        .array(z.string())
        .describe("Array of file or folder IDs to delete"),
    }),
    handler: async (params, { step: toolStep }) => {
      const parsed = deleteFileParamSchema.safeParse(params);
      if (!parsed.success) {
        return `Error: ${parsed.error.issues[0].message}`;
      }
      const { fileIds } = parsed.data;

      const filesToDelete: { id: string; name: string; type: string }[] =
        [];
      for (const fileId of fileIds) {
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
        filesToDelete.push({
          id: file._id,
          name: file.name,
          type: file.type,
        });
      }
      try {
        return await toolStep?.run("delete-files", async () => {
          const results: string[] = [];
          for (const file of filesToDelete) {
            await convexClient.mutation(
              api.system.mutations.conversations.deleteFile,
              {
                internalKey,
                fileId: file.id as Id<"files">,
              },
            );
            results.push(
              `Deleted ${file.type} "${file.name}" successfully`,
            );
          }
          return results.join("\n");
        });
      } catch (error) {
        return `Error Deleting files ${error instanceof Error ? error.message : "Unknown Error"} Use listFiles to get valid folder IDs, or use empty string for root level.`;
      }
    },
  });
};
