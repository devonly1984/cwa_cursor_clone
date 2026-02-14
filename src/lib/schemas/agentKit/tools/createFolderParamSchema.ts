import z from "zod";

export const createFolderParamSchema = z.object({
    name: z.string().min(1,"Folder name is required"),
    parentId: z.string()
})

export type CreateFolderParamSchema = z.infer<typeof createFolderParamSchema>