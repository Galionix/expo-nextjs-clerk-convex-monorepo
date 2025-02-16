import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Твой Convex деплой: https://<your-app>.convex.cloud
const convexBaseUrl = process.env.EXPO_PUBLIC_CONVEX_URL

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: convexBaseUrl,
  }),
  endpoints: (builder) => ({
    registerUserInLemonSqueezy: builder.mutation<
      { lemonId: string } | null,  // Тип ответа
      void                          // Тип аргументов (в данном случае ничего не передаём)
    >({
      query: () => ({
        // Convex Action:
        url: "/api/users:registerUserInLemonSqueezy",
        method: "POST",
        // Если нужно, можно передавать body: {...}
      }),
      // Если нужно трансформировать ответ
      transformResponse: (response: { lemonId: string }) => response,
    }),
  }),
});

export const {
  useRegisterUserInLemonSqueezyMutation,
} = userApi;
