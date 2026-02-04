import {z} from 'zod';


export const messageRequestSchema = z.object({
    conversationId:z.string(),
    message: z.string()
})

export type MessageRequestSchema = z.infer<typeof messageRequestSchema>