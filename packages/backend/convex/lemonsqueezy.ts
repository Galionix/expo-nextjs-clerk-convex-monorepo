import { v } from 'convex/values';
import { action, query } from "./_generated/server";
import {
    lemonSqueezySetup, getAuthenticatedUser,
    listProducts, listSubscriptions, cancelSubscription
} from "@lemonsqueezy/lemonsqueezy.js";
// import { v } from "convex/values";
export const lemonsqueezyKeySet = query({
    args: {},
    handler: async () => {
      return !!process.env.LEMON_SQUEEZY_API_KEY;
    },
});

export const getLemonUser = action(async () => {
    const result = lemonSqueezySetup({
        apiKey: process.env.LEMON_SQUEEZY_API_KEY,
        onError: (error) => console.error("Lemon Squeezy API Error:", error),
    });
    console.log('result: ', result);
  try {
    const { data, error } = await getAuthenticatedUser();

    if (error) {
      console.error("❌ Lemon Squeezy Auth Error:", error.message);
      throw new Error(error.message);
    }

    console.log("✅ Lemon Squeezy User Data:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch Lemon Squeezy user:", error);
    throw new Error("Failed to fetch user from Lemon Squeezy");
  }
});

export const getLemonProducts= action(async () => {
    const result = lemonSqueezySetup({
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

// Настраиваем API
// export const createLemonCheckout = action({
//   args: {
//     storeId: v.number(),   // ID магазина (Lemon Squeezy Store ID)
//     variantId: v.string(), // ID варианта продукта
//     email: v.string(),     // Email покупателя
//     // customData: "optional_object" // Дополнительные данные (необязательно)
//   },
//   handler: async (ctx, { storeId, variantId, email }) => {
//     console.log('storeId, variantId, email: ', storeId, variantId, email);
//     lemonSqueezySetup({
//       apiKey: process.env.LEMON_SQUEEZY_API_KEY,
//       onError: (error) => console.error("Lemon Squeezy API Error:", error),
//     });

//     try {
//       const { data, error } = await createCheckout(storeId, variantId, {
//         checkoutData: {
//           email,
//         //   custom: customData || {}, // Можно передавать доп. данные
//         }
//       });

//       if (error) {
//         console.error("❌ Lemon Squeezy Checkout Error:", error.message);
//         throw new Error(error.message);
//       }

//       console.log("✅ Lemon Squeezy Checkout Created:", data);
//       return data;
//     } catch (error) {
//       console.error("❌ Failed to create checkout:", error);
//       throw new Error("Failed to create checkout session");
//     }
//   },
// });

// export const getProductVariant = action({
//     args: {
//       variantId: v.string(), // ID варианта продукта
//     },
//     handler: async (ctx, { variantId }) => {
//       console.log('variantId: ',  variantId);
//       lemonSqueezySetup({
//         apiKey: process.env.LEMON_SQUEEZY_API_KEY,
//         onError: (error) => console.error("Lemon Squeezy API Error:", error),
//       });

//       try {
//         const { statusCode, error, data } = await getVariant(variantId);
//         console.log('statusCode: ', statusCode);


//         if (error) {
//           console.error("❌ Lemon Squeezy Variant Error:", error.message);
//           throw new Error(error.message);
//         }

//         console.log("✅ Lemon Squeezy Variant:", data);
//         return data;
//       } catch (error) {
//         console.error("❌ Failed to get Variant:", error);
//         throw new Error("Failed to get Variant");
//       }
//     },
//   });

// TODO: check here active subscriptions
export const getLemonSubscriptions= action(async () => {
    const result = lemonSqueezySetup({
        apiKey: process.env.LEMON_SQUEEZY_API_KEY,
        onError: (error) => console.error("Lemon Squeezy API Error:", error),
    });
    try {
        const { data, error, statusCode } = await listSubscriptions();

        if (error) {
          console.error("❌ Lemon Squeezy listSubscriptions Error:", error.message);
          throw new Error(error.message);
        }

        console.log(`✅ Lemon Squeezy listSubscriptions (Status: ${statusCode}):`, data);
        return data;
      } catch (error) {
        console.error("❌ Failed to fetch listSubscriptions from Lemon Squeezy:", error);
        throw new Error("Failed to fetch listSubscriptions from Lemon Squeezy");
    }
});

export const cancelLemonSubscription= action({
    args: {
      subscriptionId: v.string()
    },
    handler: async (ctx, { subscriptionId }) => {
        const result = lemonSqueezySetup({
            apiKey: process.env.LEMON_SQUEEZY_API_KEY,
            onError: (error) => console.error("Lemon Squeezy API Error:", error),
        });
        try {
            const { data, error, statusCode } = await cancelSubscription(subscriptionId);

            if (error) {
              console.error("❌ Lemon Squeezy cancelSubscription Error:", error.message);
              throw new Error(error.message);
            }

            console.log(`✅ Lemon Squeezy cancelSubscription (Status: ${statusCode}):`, data);
            return data;
          } catch (error) {
            console.error("❌ Failed to fetch cancelSubscription from Lemon Squeezy:", error);
            throw new Error("Failed to fetch cancelSubscription from Lemon Squeezy");
        }
    },
});
