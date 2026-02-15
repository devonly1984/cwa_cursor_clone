import z from "zod";

export const settingsSchema = z.object({
    installCommand: z.string(),
    devCommand: z.string(),
})

export type SettingsSchema = z.infer<typeof settingsSchema>