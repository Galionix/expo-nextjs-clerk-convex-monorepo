import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { StartSSOFlowParams, useOAuth, useSSO } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo"; // Используем Clerk для проверки авторизации
import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Button } from "@/components/ui/Button";
import { H1, P } from "@/components/ui/Text";
import { Surface } from "@/components/ui/Surface";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const auth = useAuth();
  const [authState, setAuthState] = React.useState({
    hello: "world",
  });
  const { startOAuthFlow: startGoogle } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startApple } = useOAuth({ strategy: "oauth_apple" });

  useWarmUpBrowser();

  useEffect(() => {
    if (auth.sessionId) {
      router.replace("/notesDashboard");
    }
  }, [auth, auth.sessionId]);
  useEffect(() => {
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
    <Surface>
      <View style={styles.root}>
        <View style={styles.viewStyles}>
          <H1>Log in to your account</H1>
          <Button
          onPress={() => onPress("google")}
          icon="google">Continue with Google</Button>
          <Button
          onPress={() => onPress("apple")}
          icon="apple">Continue with Apple</Button>
        </View>
        <View style={styles.signupContainer}>
          <P>Don’t have an account? </P>
          <P
            onPress={() => router.push("/register")}
            highlight
          >
            Sign up here.
          </P>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  viewStyles: {
    // borderColor: "red",
    // borderStyle: "solid",
    // borderWidth: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    flex: 1,
    gap: 10
  },
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 20,

    // borderColor: "red",
    // borderStyle: "solid",
    // borderWidth: 1,
  },

  signupContainer: {
    // borderColor: "red",
    // borderStyle: "solid",
    // borderWidth: 1,
    marginTop: "auto",
    flexDirection: "row",
  },
});

export default LoginScreen;
