import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { firewallClient } from "@/lib/firecrawl";
import { auth } from "@clerk/nextjs/server";
import { QUICK_EDIT_PROMPT, URL_REGEXP } from "@/lib/constants";
import { FirecrawlClient } from "@mendable/firecrawl-js";
import { google } from "@ai-sdk/google";
import { quickEditSchema } from "@/lib/suggestion/quickEdit";

export const POST = async (request: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { selectedCode, fullCode, instruction } = await request.json();
    if (!selectedCode) {
      return NextResponse.json(
        {
          error: "Selected code is required",
        },
        {
          status: 400,
        },
      );
    }
    if (!instruction) {
      return NextResponse.json(
        { error: "Instruction is required" },
        { status: 400 },
      );
    }
    const urls: string[] = instruction.match(URL_REGEXP) || [];
    let documentationContext = "";
    if (urls.length > 0) {
      const scrapedResults = await Promise.all(
        urls.map(async (url) => {
          try {
            const result = await firewallClient.scrape(url, {
              formats: ["markdown"],
            });
            if (result.markdown) {
              return `<doc url="${url}"> \n ${result.markdown}\n</doc>`;
            }
            return null;
          } catch (error) {
            return null;
          }
        }),
      );
      const validResults = scrapedResults.filter(Boolean);
      if (validResults.length > 0) {
        documentationContext = `<documentation>\n${validResults.join("\n\n")}\n</documentation>`;
      }
    }
    const prompt = QUICK_EDIT_PROMPT.replace(
      "{selectedCode}",
      selectedCode,
    )
      .replace("{fullCode}", fullCode || "")
      .replace("{instruction}", instruction)
      .replace("{documentation}", documentationContext);
    const { output } = await generateText({
      model: google("gemini-1.5-flash"),
      output: Output.object({ schema: quickEditSchema }),
      prompt,
    });
    return NextResponse.json({ editedCode: output.editedCode })
  } catch (error) {
    return NextResponse.json({ error: "Failed ot generate edit" }, { status: 500 })
  }
  
};
