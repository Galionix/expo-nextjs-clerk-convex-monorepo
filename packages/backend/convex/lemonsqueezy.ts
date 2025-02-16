import { action } from "./_generated/server";
import { v } from "convex/values";
import {
  lemonSqueezySetup,
  createCustomer,
  listCustomers,
  cancelSubscription
} from "@lemonsqueezy/lemonsqueezy.js";
import { lemonSqueezyStoreId } from "@packages/ui";
// Импортируйте сгенерированные API-функции для работы с БД, например:
import { api, internal } from "./_generated/api";

/**
 * Action для регистрации пользователя в LemonSqueezy.
 * Сначала ищем клиента в LemonSqueezy по email.
 * Если найден, просто патчим запись в Convex с lemonId.
 * Если не найден, создаём нового клиента через API LemonSqueezy и сохраняем его ID в базе.
 */
export const registerUserInLemonSqueezy = action({
  args: {},
  handler: async (ctx): Promise<{ lemonId: string } | null> => {
    // Получаем данные аутентифицированного пользователя
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        "Called registerUserInLemonSqueezy without authentication",
      );
    }
    if (!identity.email || !identity.name) {
      throw new Error("User must have email and name");
    }
    const email = identity.email;

    // 1. Проверяем, есть ли запись о пользователе в Convex (используя ранее созданный query по tokenIdentifier)
    const existingUser = await ctx.runQuery(
      internal.users.getUserByToken.getUserByToken,
      {
        tokenIdentifier: identity.tokenIdentifier,
      },
    );

    // 3. Если клиента в LemonSqueezy не найден, настраиваем SDK и создаём нового
    lemonSqueezySetup({
      apiKey: process.env.LEMON_SQUEEZY_API_KEY,
      onError: (error) => console.error("LemonSqueezy API Error:", error),
    });
    // 2. Проверяем в LemonSqueezy, есть ли клиент с таким email
    const { data: existingCustomers, error: listError } = await listCustomers({
      filter: { email },
    });
    if (listError) {
      console.error("❌ Error listing LemonSqueezy customers:", listError);
      throw new Error(listError.message);
    }

    if (existingCustomers && existingCustomers.data.length > 0) {
      // Клиент уже существует в LemonSqueezy – берем первого найденного
      const lemonUser = existingCustomers.data[0];
      console.log("✅ Found existing LemonSqueezy customer:", lemonUser.id);
      // Если пользователь уже есть в Convex, обновляем запись
      if (existingUser) {
        await ctx.runMutation(api.users.patchUser.patchUser, {
          userId: existingUser._id,
          lemonId: lemonUser.id,
        });
      } else {
        await ctx.runMutation(api.users.insertUser.insertUser, {
          tokenIdentifier: identity.tokenIdentifier,
          email: identity.email,
          name: identity.name,
          lemonId: lemonUser.id,
        });
        // Если записи нет – вставляем новую
        // await ctx.db.insert("users", {
        //   tokenIdentifier: identity.tokenIdentifier,
        //   email,
        //   name: identity.name,
        //   lemonId: lemonUser.id,
        // });
      }
      return { lemonId: lemonUser.id };
    }

    const { data, error: createError } = await createCustomer(
      lemonSqueezyStoreId,
      {
        name: identity.name,
        email,
      },
    );
    if (createError || !data || !data.data?.id) {
      console.error(
        "❌ Error creating LemonSqueezy customer:",
        createError?.message,
      );
      throw new Error(
        createError?.message || "Error creating LemonSqueezy customer",
      );
    }
    const lemonId = data.data.id;
    console.log("✅ Created new LemonSqueezy customer:", lemonId);

    // 4. Сохраняем запись в Convex: если запись существует, patch; иначе, insert
    if (existingUser) {
      await ctx.runMutation(api.users.patchUser.patchUser, {
        userId: existingUser._id,
        lemonId,
      });
    } else {
      await ctx.runMutation(api.users.insertUser.insertUser, {
        tokenIdentifier: identity.tokenIdentifier,
        email: identity.email,
        name: identity.name,
        lemonId,
      });
    }
    //   await ctx.db.insert("users", {
    //     tokenIdentifier: identity.tokenIdentifier,
    //     email,
    //     name: identity.name,
    //     lemonId,
    //   });
    // }

    return { lemonId };
  },
});

export const cancelLemonSubscription = action({
  args: {
    subscriptionId: v.string(),
  },
  handler: async (ctx, { subscriptionId }) => {
    const result = lemonSqueezySetup({
      apiKey: process.env.LEMON_SQUEEZY_API_KEY,
      onError: (error) => console.error("Lemon Squeezy API Error:", error),
    });
    try {
      const { data, error, statusCode } =
        await cancelSubscription(subscriptionId);

      if (error) {
        console.error(
          "❌ Lemon Squeezy cancelSubscription Error:",
          error.message,
        );
        throw new Error(error.message);
      }

      console.log(
        `✅ Lemon Squeezy cancelSubscription (Status: ${statusCode}):`,
        data,
      );
      return data;
    } catch (error) {
      console.error(
        "❌ Failed to fetch cancelSubscription from Lemon Squeezy:",
        error,
      );
      throw new Error("Failed to fetch cancelSubscription from Lemon Squeezy");
    }
  },
});