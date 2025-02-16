import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { router } from "expo-router"; // или свой механизм навигации

export async function openCheckout(url: string) {
//   const checkoutUrl = "https://lemonsqueezy.com/checkout/...";
  const redirectUrl = Linking.createURL("auth");
  console.log("Redirect URL:", redirectUrl);

  const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);
  console.log("Result from openAuthSessionAsync:", result);

  // Если result.type не равен "success", попробуй получить начальный URL
  if (result.type !== "success") {
    const initialUrl = await Linking.getInitialURL();
    console.log("Initial URL:", initialUrl);
  }
}

// Дополнительно, слушаем deep link через Linking:
export function useDeepLinkHandler() {
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link received:", url);
      const { queryParams } = Linking.parse(url);
      if (queryParams?.success === "true") {
        router.push("/notesDashboard");
      }
    });
    return () => subscription.remove();
  }, []);
}
