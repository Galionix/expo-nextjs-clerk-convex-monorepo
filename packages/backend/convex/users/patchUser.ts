import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const patchUser = mutation({
  args: {
    userId: v.id("users"),
    lemonId: v.string(),
  },
  handler: async (ctx, { userId, lemonId }) => {
    await ctx.db.patch(userId, { lemonId });
  },
});
