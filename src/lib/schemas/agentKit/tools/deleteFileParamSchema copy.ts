import z from "zod";

export const deleteFileParamSchema = z.object({
   fileIds: z.array(
    z.string()            ).min(1, "Provide at least one file to delete")
})

export type DeleteFileParamSchema = z.infer<typeof deleteFileParamSchema>