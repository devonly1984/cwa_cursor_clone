import { serve } from "inngest/next";
import { InngestClient } from "@/lib/inngest/client";
import { demoGenerate,  } from "@/lib/inngest/functions";
import { processMessage } from "@/components/conversations/inngest/ProcessMessage";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: InngestClient,
  functions: [

    demoGenerate,
    processMessage
  ],
});