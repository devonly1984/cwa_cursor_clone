import {z} from 'zod';


export const readFileParamSchema = z.object({
    fileIds: z.array(z.string().min(1,"File Id cannot be empty")).min(1,"Provide at least one file ID")
})


export type ReadFileParamSchema = z.infer<typeof readFileParamSchema>