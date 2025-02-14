import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }),
  users: defineTable({
    userId: v.string(), // ID из Clerk
    email: v.string(),
    name: v.optional(v.string()),
    lemonSqueezyId: v.optional(v.string()), // ID из LemonSqueezy
  }).index("by_userId", ["userId"]),
});
