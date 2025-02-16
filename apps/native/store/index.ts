import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./userApi";
import userReducer from "./userSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    // RTK Query API
    [userApi.reducerPath]: userApi.reducer,
    // Наш Slice
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

// Для оптимизации рефрешей
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
