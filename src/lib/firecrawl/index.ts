import FireCrawl from "@mendable/firecrawl-js";

export const firewallClient = new FireCrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});
