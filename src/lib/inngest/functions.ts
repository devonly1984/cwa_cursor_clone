import { InngestClient } from "@/lib/inngest/client";
import {generateText} from 'ai'
import {google} from '@ai-sdk/google'
import { URL_REGEXP } from "../constants";
import { firecrawlClient } from "../firecrawl";


export const demoGenerate = InngestClient.createFunction(
  { id: "demo-generate" },
    { event: "demo/generate" },
  async ({  event,step }) => {
    const { prompt } = event.data as { prompt: string }
    const urls = await step.run('extract-urls',async()=>{
      return prompt.match(URL_REGEXP) || []
    }) as string[]
    const scrapedContent = await step.run('scrape-urls',async()=>{
      const results = await Promise.all(
        urls.map(async(url)=>{
          const result = await firecrawlClient.scrape(
            url, { formats: ['markdown'] }
          )
          return result.markdown ?? null;
        })
      )
      return results.filter(Boolean).join("\n\n")
    })
    const finalPrompt = scrapedContent ? `Context:\n${scrapedContent}\n\n Question ${prompt}` : prompt;
    await step.run('generate-text',async()=>{
        return await generateText({
            model: google('gemini-2.0-flash'),
          prompt: finalPrompt,
          experimental_telemetry: {
            isEnabled:true,
            recordInputs: true,
            recordOutputs: true
          }
        })
    })
  },
);