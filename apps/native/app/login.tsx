import React, { useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { StartSSOFlowParams, useOAuth, useSSO } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo"; // Используем Clerk для проверки авторизации
import { useEffect } from "react";
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

const LoginScreen = () => {
  const auth = useAuth()
  const [authState, setAuthState] = React.useState({
    hello: 'world'
  })
  const { startOAuthFlow: startGoogle } = useOAuth({ strategy: 'oauth_google' })
  const { startOAuthFlow: startApple } = useOAuth({ strategy: 'oauth_apple' })

  useWarmUpBrowser()

  useEffect(() => {
    if (auth.sessionId) {
      router.replace('/notesDashboard')
    }
  },[auth,auth.sessionId])
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
  const onPress = async (authType: string) => {
    try {
      if (authType === "google") {
        const { createdSessionId, signIn, signUp, setActive, authSessionResult } = await startGoogle({
          redirectUrl: Linking.createURL('/login', { scheme: 'myapp' }),
        })
        if (createdSessionId) {
          setActive!({ session: createdSessionId })
        }
      } else if (authType === "apple") {
        const { createdSessionId, signIn, signUp, setActive, authSessionResult } = await startApple({
          redirectUrl: Linking.createURL('/login', { scheme: 'myapp' }),
        })
        if (createdSessionId) {
          setActive!({ session: createdSessionId })
        }
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };
  // const onPress = useCallback(async () => {
  //   try {
  //     // Start the authentication process by calling `startSSOFlow()`
  //     const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
  //       strategy: 'oauth_google',
  //     })
  //     console.log('createdSessionId: ', createdSessionId);

  //     // If sign in was successful, set the active session
  //     if (createdSessionId) {
  //       setActive!({ session: createdSessionId })
  //       router.push("/notesDashboard");
  //     } else {
  //       // signIn?.create
  //       // If there is no `createdSessionId`,
  //       // there are missing requirements, such as MFA
  //       // Use the `signIn` or `signUp` returned from `startSSOFlow`
  //       // to handle next steps
  //     }
  //   } catch (err) {
  //     // See https://clerk.com/docs/custom-flows/error-handling
  //     // for more info on error handling
  //     console.error(JSON.stringify(err, null, 2))
  //   }
  // }, [])

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../assets/icons/logo.png")} // Ensure the correct path to your logo image file
          style={styles.logo}
        />
        <Text style={styles.title}>Log in to your account</Text>
        <Text style={styles.subtitle}>Welcome! Please login below.</Text>
        <TouchableOpacity
          style={styles.buttonGoogle}
          onPress={() => onPress("google")}
        >
          <Image
            style={styles.googleIcon}
            source={require("../assets/icons/google.png")}
          />
          <Text style={{ ...styles.buttonText, color: "#344054" }}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonApple}
          onPress={() => onPress("apple")}
        >
          <AntDesign name="apple1" size={24} color="black" />
          <Text
            style={{ ...styles.buttonText, color: "#344054", marginLeft: 12 }}
          >
            Continue with Apple
          </Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={{ fontFamily: "Regular" }}>Don’t have an account? </Text>
          <Text>Sign up above.</Text>
        </View>

      </View>
      <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>JSON Output:</Text>
      <Text style={{ fontSize: 14, color: "#333", marginTop: 10 }}>
        {JSON.stringify(auth, null, 2)}
      </Text>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    width: "98%",
  },
  logo: {
    width: 74,
    height: 74,
    marginTop: 20,
  },
  title: {
    marginTop: 49,
    fontSize: RFValue(21),
    fontFamily: "SemiBold",
  },
  subtitle: {
    marginTop: 8,
    fontSize: RFValue(14),
    color: "#000",
    fontFamily: "Regular",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontFamily: "Regular",
    fontSize: RFValue(14),
  },
  buttonEmail: {
    backgroundColor: "#0D87E1",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 24,
    minHeight: 44,
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontFamily: "SemiBold",
    fontSize: RFValue(14),
  },
  buttonTextWithIcon: {
    marginLeft: 10,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#000",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#000",
    fontFamily: "Medium",
  },
  buttonGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    width: "100%",
    marginBottom: 12,
    height: 44,
  },
  buttonApple: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    width: "100%",
    marginBottom: 32,
  },
  signupContainer: {
    flexDirection: "row",
  },
  signupText: {
    color: "#4D9DE0",
    fontFamily: "SemiBold",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  errorText: {
    fontSize: RFValue(14),
    color: "tomato",
    fontFamily: "Medium",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default LoginScreen;
