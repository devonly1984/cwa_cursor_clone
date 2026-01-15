import { Inngest } from "inngest";
import { sentryMiddleware } from "@inngest/middleware-sentry";

export const InngestClient = new Inngest({
  id: "cursor-clone",
  middleware: [sentryMiddleware()],
});
