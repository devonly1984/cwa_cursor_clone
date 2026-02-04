/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as lib_constants from "../lib/constants.js";
import type * as lib_utils from "../lib/utils.js";
import type * as mutations_conversations from "../mutations/conversations.js";
import type * as mutations_files from "../mutations/files.js";
import type * as mutations_projects from "../mutations/projects.js";
import type * as queries_conversations from "../queries/conversations.js";
import type * as queries_files from "../queries/files.js";
import type * as queries_projects from "../queries/projects.js";
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
  "lib/constants": typeof lib_constants;
  "lib/utils": typeof lib_utils;
  "mutations/conversations": typeof mutations_conversations;
  "mutations/files": typeof mutations_files;
  "mutations/projects": typeof mutations_projects;
  "queries/conversations": typeof queries_conversations;
  "queries/files": typeof queries_files;
  "queries/projects": typeof queries_projects;
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
