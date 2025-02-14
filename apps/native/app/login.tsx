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
import {
  StartSSOFlowParams,
  useOAuth,
  useSSO,
  useUser,
} from "@clerk/clerk-expo";
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
import { useToast } from "@/components/Toast/Toast";
import { useTranslation } from "react-i18next";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery, useAction, useMutation } from "convex/react";
import { useRegisterCustomer } from '@/hooks/registerCustomer';

const LoginScreen = () => {
  const toaster = useToast();
  const user = useUser();
  const auth = useAuth();
  console.log("auth: ", auth);
  const createLemonUser = useAction(api.lemonsqueezy.createLemonUser);
  const existingLemonId = useQuery(api.lemonsqueezy.getLemonId);
  console.log("existingLemonId: ", existingLemonId);
  const writeLemonToDb = useMutation(api.lemonsqueezy.writeLemonToDb);
  // const create = async (data) => createCustomer(data)
  // useEffect(() => {
  //   if (auth.sessionId && user && existingLemonId) {
  //     router.replace("/notesDashboard");
  //   }
  //   if (auth.sessionId && user && !existingLemonId) {
  //     // router.replace("/notesDashboard");
  //     const email = user.user?.primaryEmailAddress?.emailAddress;
  //     const name = user.user?.fullName;
  //     if (!email) {
  //       toaster.show({
  //         type: "error",
  //         message:
  //           "Cant find your email by user.user?.primaryEmailAddress?.emailAddress",
  //       });

  //       return;
  //     }
  //     if (!name) {
  //       toaster.show({
  //         type: "error",
  //         message: "Cant find your name by user.user?.fullName",
  //       });
  //       return;
  //     }
  //     const flow = async () => {
  //       try {
  //         const lemonId = await createLemonUser({
  //           storeId: lemonSqueezyStoreId,
  //           email,
  //           name,
  //         });
  //         console.log("created lemonId: ", lemonId);
  //         if (lemonId) {
  //           const writeLemonToDbRes = await writeLemonToDb({
  //             lemonId,
  //           });
  //           console.log("writeLemonToDbRes: ", writeLemonToDbRes);
  //         }
  //       } catch (e) {
  //         console.log(e);
  //         toaster.show({
  //           type: "error",
  //           message: "Cannot create customer.",
  //         });
  //       }
  //     };
  //     flow();

  //     console.log("email:", user.user?.primaryEmailAddress?.emailAddress);
  //     console.log("name:", user.user?.fullName);
  //   }

  // }, [user, auth, auth.sessionId, existingLemonId]);
  useRegisterCustomer();
  const { t } = useTranslation();
  return (
    <Surface>
      <View style={styles.root}>
        <View style={styles.viewStyles}>
          <H1>{t("common.welcome")}</H1>
          <H1>{t("auth.logInToYourAccount")}</H1>
          <AuthButtons />
        </View>
        <View style={styles.signupContainer}>
          <P
            style={{
              maxWidth: 200,
            }}
          >
            {t("auth.signUpUsingEmail")}
          </P>
          <P onPress={() => router.push("/(auth)/sign-up")} highlight>
            {t("auth.signUpHere")}
          </P>
        </View>
        <View style={styles.signupContainer}>
          <P
            style={{
              maxWidth: 200,
            }}
          >
            {t("auth.signInUsingEmail")}
          </P>
          <P onPress={() => router.push("/(auth)/sign-in")} highlight>
            {t("auth.signInHere")}
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
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
});

export default LoginScreen;
