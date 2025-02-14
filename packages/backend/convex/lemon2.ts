import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { createCustomer, listCustomers } from "@lemonsqueezy/lemonsqueezy.js";
import { api, internal } from "./_generated/api";
import { lemonSqueezyStoreId } from "@packages/ui";

interface User {
    _id: string;
    userId: string;
    email: string;
    name?: string;
    lemonSqueezyId?: string;
}

// ✅ Запрос на получение пользователя по ID
export const getUser = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

// ✅ Функция регистрации пользователя в LemonSqueezy (если он ещё не зарегистрирован)
export const registerUserInLemonSqueezy = mutation({
  args: { userId: v.string(), email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, { userId, email, name }): Promise<string> => {
    // if (!userId) return null;
    // userId
    console.log(
      "🔥 Проверяем, зарегистрирован ли пользователь в LemonSqueezy:",
      email,
    );

    // ✅ Проверяем, есть ли пользователь в Convex
    const existingUser: User | null = await ctx.runQuery(internal.lemon2.getUser, { userId });
    //   const userId = await getUserId(ctx);
    // const userId = await getUserId(ctx);
    // ✅ Если есть ID из LemonSqueezy, ничего не делаем
    if (existingUser?.lemonSqueezyId) {
      console.log(
        "✅ Пользователь уже зарегистрирован в LemonSqueezy:",
        existingUser.lemonSqueezyId,
      );
      return existingUser.lemonSqueezyId;
    }

    // ✅ Проверяем, есть ли пользователь в LemonSqueezy
    const { data: existingCustomers, error } = await listCustomers({
      filter: {
        email,
      },
    });

    if (error) {
      console.error("❌ Ошибка при поиске пользователя в LemonSqueezy:", error);
      throw new Error(error.message);
    }

    if (existingCustomers.data?.length > 0) {
      const lemonUser = existingCustomers.data[0];
      console.log("✅ Пользователь уже есть в LemonSqueezy:", lemonUser.id);

      // ✅ Сохраняем связь в Convex
      await ctx.db.insert("users", {
        userId,
        email,
        name,
        lemonSqueezyId: lemonUser.id,
      });

      return lemonUser.id;
    }

    // ✅ Если пользователя нет — создаём
    try {
      const { data, error } = await createCustomer(lemonSqueezyStoreId,{
        // store_id: process.env.LEMON_SQUEEZY_STORE_ID,
        email,
        name: name || "User",
      });

      if (error) {
        console.error("❌ Ошибка регистрации в LemonSqueezy:", error.message);
        throw new Error(error.message);
      }

      console.log("✅ Новый пользователь создан в LemonSqueezy:", data);

      // ✅ Добавляем его в Convex
      await ctx.db.insert("users", {
        userId,
        email,
        name,
        lemonSqueezyId: data.data?.id,
      });

      return data.data?.id;
    } catch (error) {
      console.error("❌ Ошибка создания пользователя в LemonSqueezy:", error);
      throw new Error("Failed to create LemonSqueezy customer");
    }
  },
});
