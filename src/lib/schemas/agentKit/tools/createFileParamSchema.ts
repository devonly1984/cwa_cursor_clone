import z from "zod";

export const createFileParamSchema = z.object({
    parentId: z.string(),
    files: z.array(
        z.object({
            name: z.string().min(1,"File name cannot be empty"),
            content: z.string()
        })
    ).min(1,"Provide at least one file to create")
})

export type CreateFileParamSchema = z.infer<typeof createFileParamSchema>