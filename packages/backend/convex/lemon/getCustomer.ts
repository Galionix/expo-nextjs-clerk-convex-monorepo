import { action } from "../_generated/server";
import { getCustomer } from "@lemonsqueezy/lemonsqueezy.js";
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { api, internal } from "../_generated/api";

/**
 * Action для получения списка подписок (subscriptions) пользователя
 * из Lemon Squeezy. Требует, чтобы в базе Convex у пользователя
 * был сохранён lemonId.
 */
export const getCustomerData = action({
  args: {},
  handler: async (ctx) => {
    // 1. Получаем аутентифицированного пользователя из Clerk/Convex
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called getCustomerData without authentication");
    }

    // Предполагаем, что у нас есть query `getUserByToken` (или похожая),
    // которая находит пользователя по tokenIdentifier.
    const existingUser = await ctx.runQuery(internal.users.getUserByToken.getUserByToken, {
      tokenIdentifier: identity.tokenIdentifier,
    });

    if (!existingUser || !existingUser.lemonId) {
      throw new Error("User not found in Convex or missing lemonId");
    }

    // 2. Настраиваем Lemon Squeezy SDK
    lemonSqueezySetup({
      apiKey: process.env.LEMON_SQUEEZY_API_KEY,
      onError: (error) => console.error("LemonSqueezy API Error:", error),
    });

    // 3. Вызываем getCustomer, указывая include: ["subscriptions"] или что-то ещё
    // Пример: include: ["subscriptions", "orders"]
    const { data, error, statusCode } = await getCustomer(existingUser.lemonId, {
      include: ["subscriptions", 'license-keys', 'orders', 'store'],
    });

    if (error) {
      console.error("❌ Error fetching customer from LemonSqueezy:", error.message);
      throw new Error(error.message);
    }

    // 4. Возвращаем data — в нём будет информация о клиенте, включая subscriptions
    console.log("✅ getUserSubscriptions status:", statusCode, " data:", data);
    return data;
  },
});
