/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions from "../actions.js";
import type * as activities from "../activities.js";
import type * as agents from "../agents.js";
import type * as brain from "../brain.js";
import type * as config from "../config.js";
import type * as content from "../content.js";
import type * as kanban from "../kanban.js";
import type * as search from "../search.js";
import type * as seed from "../seed.js";
import type * as seed_polish from "../seed_polish.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  activities: typeof activities;
  agents: typeof agents;
  brain: typeof brain;
  config: typeof config;
  content: typeof content;
  kanban: typeof kanban;
  search: typeof search;
  seed: typeof seed;
  seed_polish: typeof seed_polish;
  tasks: typeof tasks;
  users: typeof users;
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
