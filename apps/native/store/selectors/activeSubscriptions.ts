import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store"; // Обязательно укажите правильный путь к вашему RootState
import { ListProducts, Subscription } from "@lemonsqueezy/lemonsqueezy.js";

export const selectActiveSubscriptions = createSelector(
  // В качестве входного селектора получаем объект customer из userSlice
  [(state: RootState) => state.user.customer],
  (customer) => {
    if (!customer || !customer.included || !Array.isArray(customer.included)) {
      return [];
    }
    return customer.included
      .filter(
        (item) =>
          item.type === "subscriptions" &&
          (item.attributes.status === "subscribed" ||
            item.attributes.status === "active")
      ) as unknown as Subscription["data"][];
  }
);
