import { defineSchema } from "convex/server";

import { conversations, files,messages,projects } from "./tables";

export default defineSchema({
    projects,
    files,
    conversations,
    messages
})