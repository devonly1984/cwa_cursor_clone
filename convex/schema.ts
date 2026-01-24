import { defineSchema } from "convex/server";

import { files,projects } from "./tables";

export default defineSchema({
    projects,
    files
})