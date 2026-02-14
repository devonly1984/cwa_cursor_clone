import { createTool } from "@inngest/agent-kit";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import z from "zod";
import { readFileParamSchema } from "@/lib/schemas/agentKit/tools/readFileParamSchema";
import { convexClient } from "@/lib/convex/convexClient";

interface ReadFilesToolOptions {
  internalKey: string;
}

export const createReadFilesTool = ({
  internalKey,
}: ReadFilesToolOptions) => {
  return createTool({
    name: "readFiles",
    description:
      "Read the content of files from the project. Returns file contents.",
    parameters: z.object({
      fileIds: z.array(z.string()).describe("Array of file IDs to read"),
    }),
    handler: async (params, { step: toolStep }) => {
      const parsed = readFileParamSchema.safeParse(params);
      if (!parsed.success) {
        return `Error: ${parsed.error.issues[0].message}`;
      }
      const { fileIds } = parsed.data;
      try {
        return await toolStep?.run("read-files", async () => {
          const results: { id: string; name: string; content: string }[] =
            [];
          for (const fileId of fileIds) {
            const file = await convexClient.query(
              api.system.queries.conversations.getFileById,
              {
                internalKey,
                fileId: fileId as Id<"files">,
              },
            );
            if (file && file.content) {
              results.push({
                id: file._id,
                name: file.name,
                content: file.content,
              });
            }
          }
          if (results.length === 0) {
            return "Error: No files found with provided IDs. Use listFiles to get valid fileIDs";
          }
          return JSON.stringify(results);
        });
      } catch (error) {
        return `Error reading files: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
};
