/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as public_lib_constants from "../public/lib/constants.js";
import type * as public_lib_utils from "../public/lib/utils.js";
import type * as public_mutations_conversations from "../public/mutations/conversations.js";
import type * as public_mutations_files from "../public/mutations/files.js";
import type * as public_mutations_projects from "../public/mutations/projects.js";
import type * as public_queries_conversations from "../public/queries/conversations.js";
import type * as public_queries_files from "../public/queries/files.js";
import type * as public_queries_projects from "../public/queries/projects.js";
import type * as system_lib_utils from "../system/lib/utils.js";
import type * as system_mutations_conversations from "../system/mutations/conversations.js";
import type * as system_queries_conversations from "../system/queries/conversations.js";
import type * as tables_conversations from "../tables/conversations.js";
import type * as tables_files from "../tables/files.js";
import type * as tables_index from "../tables/index.js";
import type * as tables_messages from "../tables/messages.js";
import type * as tables_projects from "../tables/projects.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "public/lib/constants": typeof public_lib_constants;
  "public/lib/utils": typeof public_lib_utils;
  "public/mutations/conversations": typeof public_mutations_conversations;
  "public/mutations/files": typeof public_mutations_files;
  "public/mutations/projects": typeof public_mutations_projects;
  "public/queries/conversations": typeof public_queries_conversations;
  "public/queries/files": typeof public_queries_files;
  "public/queries/projects": typeof public_queries_projects;
  "system/lib/utils": typeof system_lib_utils;
  "system/mutations/conversations": typeof system_mutations_conversations;
  "system/queries/conversations": typeof system_queries_conversations;
  "tables/conversations": typeof tables_conversations;
  "tables/files": typeof tables_files;
  "tables/index": typeof tables_index;
  "tables/messages": typeof tables_messages;
  "tables/projects": typeof tables_projects;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
