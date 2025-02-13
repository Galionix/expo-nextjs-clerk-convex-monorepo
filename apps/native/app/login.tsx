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
import { AuthButtons } from "@/components/ui/authButtons";
import { useTheme } from "react-native-paper";
import { useToast } from '@/components/Toast/Toast';
import { useTranslation } from "react-i18next";

const LoginScreen = () => {
  const toaster = useToast();

  const auth = useAuth();
  useEffect(() => {
    if (auth.sessionId) {
      router.replace("/notesDashboard");
    }
  }, [auth, auth.sessionId]);

  useEffect(() => {
    toaster.show({
      message: "Login successful",

    });
  }, []);
  const { t, i18n } = useTranslation();
  return (
    <Surface>
      <View style={styles.root}>
        <View style={styles.viewStyles}>
          <H1>Log in to your account</H1>
          <H1>{t("common.welcome")}</H1>
          <AuthButtons />
        </View>
        <View style={styles.signupContainer}>
          <P>Sign up using email? </P>
          <P onPress={() => router.push("/(auth)/sign-up")} highlight>
            Sign up here.
          </P>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  viewStyles: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    flex: 1,
    gap: 10,
  },
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 20,
  },

  signupContainer: {
    marginTop: "auto",
    flexDirection: "row",
  },
});

export default LoginScreen;
