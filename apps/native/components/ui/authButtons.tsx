import { useAuth } from "@clerk/clerk-expo"; // Используем Clerk для проверки авторизации
import React, { useCallback } from "react";
import { StartSSOFlowParams, useOAuth, useSSO } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "@/hooks/warmupBrowser";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Button } from "./Button";

WebBrowser.maybeCompleteAuthSession();

export const AuthButtons = () => {
  const auth = useAuth();
  const [authState, setAuthState] = React.useState({
    hello: "world",
  });
  const { startOAuthFlow: startGoogle } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startApple } = useOAuth({ strategy: "oauth_apple" });
  useWarmUpBrowser();
  React.useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const onPress = async (authType: string) => {
    try {
      if (authType === "google") {
        const {
          createdSessionId,
          signIn,
          signUp,
          setActive,
          authSessionResult,
        } = await startGoogle({
          redirectUrl: Linking.createURL("/login", { scheme: "myapp" }),
        });
        if (createdSessionId) {
          setActive!({ session: createdSessionId });
        }
      } else if (authType === "apple") {
        const {
          createdSessionId,
          signIn,
          signUp,
          setActive,
          authSessionResult,
        } = await startApple({
          redirectUrl: Linking.createURL("/login", { scheme: "myapp" }),
        });
        if (createdSessionId) {
          setActive!({ session: createdSessionId });
        }
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };
  return (
    <>
      <Button onPress={() => onPress("google")} icon="google">
        Continue with Google
      </Button>
      <Button onPress={() => onPress("apple")} icon="apple">
        Continue with Apple
      </Button>
    </>
  );
};
