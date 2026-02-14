import z from 'zod';

export const updateFileParamsSchema = z.object({
    fileId: z.string().min(1,"File ID is required"),
    content: z.string()
})

export type UpdateFileParamsSchema = z.infer<typeof updateFileParamsSchema>