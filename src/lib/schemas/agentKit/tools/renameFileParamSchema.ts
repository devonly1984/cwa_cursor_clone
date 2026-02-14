import z from "zod";

export const renameFileParamSchema = z.object({
    fileId: z.string().min(1,"File ID is required"),
    newName: z.string().min(1, "New Name is required")
})
export type RenameFileParamSchema = z.infer<typeof renameFileParamSchema>