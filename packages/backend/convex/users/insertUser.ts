import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const insertUser = mutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    lemonId: v.string(),
  },
  handler: async (ctx, { tokenIdentifier, email, name, lemonId }) => {
    await ctx.db.insert("users", {
      tokenIdentifier,
      email,
      name,
      lemonId,
    });
  },
});
