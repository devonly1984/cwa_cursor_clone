import z from "zod";

export const editResponseSchema = z.object({
    editedCode: z.string().describe(
        "The edited version of the selected code based on the instruction"
    )
})

export const editRequestSchema = z.object({
    selectedCode: z.string(),
    fullCode:z.string(),
    instruction: z.string()
})
export type EditRequest = z.infer<typeof editRequestSchema>;
export type EditResponse = z.infer<typeof editResponseSchema>