/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as lemon_getCustomer from "../lemon/getCustomer.js";
import type * as lemon_getLemonProducts from "../lemon/getLemonProducts.js";
import type * as lemon2 from "../lemon2.js";
import type * as lemonsqueezy from "../lemonsqueezy.js";
import type * as notes from "../notes.js";
import type * as openai from "../openai.js";
import type * as users_getUserByToken from "../users/getUserByToken.js";
import type * as users_insertUser from "../users/insertUser.js";
import type * as users_patchUser from "../users/patchUser.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "lemon/getCustomer": typeof lemon_getCustomer;
  "lemon/getLemonProducts": typeof lemon_getLemonProducts;
  lemon2: typeof lemon2;
  lemonsqueezy: typeof lemonsqueezy;
  notes: typeof notes;
  openai: typeof openai;
  "users/getUserByToken": typeof users_getUserByToken;
  "users/insertUser": typeof users_insertUser;
  "users/patchUser": typeof users_patchUser;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
