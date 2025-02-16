import React, { useEffect, useRef, useState } from "react";
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
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Button } from "@/components/ui/Button";
import { H1, P } from "@/components/ui/Text";
import { Surface } from "@/components/ui/Surface";
import { AuthButtons } from "@/components/ui/authButtons";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useToast } from "@/components/Toast/Toast";
import { useTranslation } from "react-i18next";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery, useAction, useMutation } from "convex/react";
import { useRegisterAndNavigate } from "@/hooks/registerCustomer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
// import { useRegisterCustomer } from '@/hooks/registerCustomer';
import { setLemonId } from "@/store/userSlice";

const LoginScreen = () => {
  const toaster = useToast();
  const user = useUser();
  const { isSignedIn } = useAuth();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const loading = useRegisterAndNavigate();
  // const [loading, setLoading] = useState(false);
  const lemonId = useSelector((state: RootState) => state.user.lemonId);
  console.log("lemonId: ", lemonId);
  // const { loading } = useRegisterAndNavigate();
  // useEffect(() => {
  //   if (isSignedIn) {
  //     setLoading(true);
  //     registerUser()
  //       .then((data) => {
  //         if (data && data.lemonId) {
  //           dispatch(setLemonId(data.lemonId));
  //         }
  //       })
  //       .catch((error) => {
  //         toaster.show({
  //           type: "error",
  //           message: t("auth.registrationError"),
  //         });
  //         console.error("Registration error:", error);
  //         setLoading(false);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [isSignedIn]);

  //   // Эффект для навигации, когда lemonId обновляется в сторе
  //   useEffect(() => {
  //     if (lemonId) {
  //       router.push("/notesDashboard");
  //     }
  //   }, [lemonId]);


  if (loading) {
    return (
      <Surface>
        <ActivityIndicator size="large" color="#0D87E1" />
      </Surface>
    );
  }
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
