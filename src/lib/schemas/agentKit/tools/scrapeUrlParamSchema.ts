import {z} from 'zod';

export const scrapeUrlParamSchema = z.object({
    urls: z.array(
        z.url('Invalid URL format').min(1, "Provide at least one URL to scrape")
    )
})


export type ScrapeUrlParamSchema = z.infer<typeof scrapeUrlParamSchema>