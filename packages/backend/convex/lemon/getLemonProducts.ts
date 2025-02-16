import { v } from "convex/values";
import { action, query, mutation, internalAction } from "../_generated/server";
import { internal, api } from "../_generated/api";

import {
  lemonSqueezySetup,
  getAuthenticatedUser,
  listProducts,
  listSubscriptions,
  cancelSubscription,
  createCustomer,
  type NewCustomer,
  getCustomer,
} from "@lemonsqueezy/lemonsqueezy.js";
export const getLemonProducts = action(async () => {
  lemonSqueezySetup({
    apiKey: process.env.LEMON_SQUEEZY_API_KEY,
    onError: (error) => console.error("Lemon Squeezy API Error:", error),
  });
  try {
    const { data, error, statusCode } = await listProducts();

    if (error) {
      console.error("❌ Lemon Squeezy Products Error:", error.message);
      throw new Error(error.message);
    }

    console.log(`✅ Lemon Squeezy Products (Status: ${statusCode}):`, data);
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch products from Lemon Squeezy:", error);
    throw new Error("Failed to fetch products from Lemon Squeezy");
  }
});
