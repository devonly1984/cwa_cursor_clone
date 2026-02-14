import {z} from 'zod';

export const cancelRequestSchema = z.object({
    projectId: z.string()
})


export type CancelRequestSchema = z.infer<typeof cancelRequestSchema>