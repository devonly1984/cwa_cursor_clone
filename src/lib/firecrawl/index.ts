import FireCrawl from "@mendable/firecrawl-js";

export const firecrawlClient = new FireCrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});
