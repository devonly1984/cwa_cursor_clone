import { createTool } from "@inngest/agent-kit";
import { api } from "../../../../../convex/_generated/api";
import { convexClient } from "@/lib/convex/convexClient";

import z from "zod";
import { Id } from "../../../../../convex/_generated/dataModel";
import { createFileParamSchema } from "@/lib/schemas/agentKit/tools/createFileParamSchema";

interface CreateFilesToolOptions {
  projectId: Id<"projects">;
  internalKey: string;
}

export const createCreateFilesTool = ({
  internalKey,
  projectId,
}: CreateFilesToolOptions) => {
  return createTool({
    name: "createFiles",
    description:
      "Create multiple files at once in the same folder. Use this to batch create files that share the same parent folder. More efficient than creating files one by one.",
    parameters: z.object({
  parentId: z.string().describe("The ID of the parent folder. Use empty string for root level. Must be a valid folder ID from listFiles"),
  files: z.array(
    z.object({
      name: z.string().describe("The file name including extension"),
      content: z.string().describe("The file content")
    })
  ).describe("Array of files to create")
    }),
    handler: async (params, { step: toolStep }) => {
      const parsed = createFileParamSchema.safeParse(params);
      if (!parsed.success) {
        return `Error: ${parsed.error.issues[0].message}`;
      }
      const { parentId,files } = parsed.data;

    

      try {
        return await toolStep?.run("create-files", async () => {
        let resolvedParentId: Id<'files'> |undefined;
        if (parentId && parentId!=="") {
          try {
            resolvedParentId = parentId as Id<'files'>;
            const parentFolder = await convexClient.query(api.system.queries.conversations.getFileById,{
              internalKey,
              fileId: resolvedParentId
            });
            if (!parentFolder) {
              return `Error: Parent folder with ID "${parentId}" not found. use listFiles to get valid folder IDs.`
            }
            if (parentFolder.type!=='folder') {
              return `Error: The ID "${parentId}" is a file, not a folder. Use a folder ID as parentId.`;

            }

          }
          catch  { 
            return `Error: Invalid parentId "${parentId}". Use listFiles to get valid folder IDs, or use empty string for root level.`
          }
        }
        const results = await convexClient.mutation(api.system.mutations.conversations.createFiles,{
          internalKey,
          projectId,
          parentId: resolvedParentId,
          files
        });
          const created = results.filter(r => !r.error);
          const failed = results.filter(r=>r.error);
          let response = `Created ${created.length} file(s)`;
          if (created.length > 0) {
            response += `: ${created.map(r => r.name).join(", ")}`
          }
          if (failed.length > 0) {
            response += `. Failed: ${failed.map(r => `${r.name} (${r.error})`).join(", ")}`
          }
          return response;
        });
      } catch (error) {
        return `Error creating files: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
};
