
import {z} from 'zod';

export const requestSchema  = z.object({
    fileName: z.string(),
    code: z.string(),
    currentLine: z.string(),
    previousLines: z.string(),
    textBeforeCursor: z.string(),
    textAfterCursor: z.string(),
    nextLines: z.string(),
    lineNumber: z.number()
})

export const responseSchema = z.object({
    suggestion: z.string()
})

export type SuggestionRequest = z.infer<typeof requestSchema>;
export type SuggestionResponse = z.infer<typeof responseSchema>;