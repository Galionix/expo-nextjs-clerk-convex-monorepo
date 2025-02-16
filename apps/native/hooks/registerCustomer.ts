// import React, { useCallback } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ScrollView,
// } from "react-native";
// import { RFValue } from "react-native-responsive-fontsize";
// import {
//   StartSSOFlowParams,
//   useOAuth,
//   useSSO,
//   useUser,
// } from "@clerk/clerk-expo";
// import { AntDesign } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useAuth } from "@clerk/clerk-expo"; // Используем Clerk для проверки авторизации
// import { useEffect } from "react";
// import * as WebBrowser from "expo-web-browser";
// import * as Linking from "expo-linking";
// import { Button } from "@/components/ui/Button";
// import { H1, P } from "@/components/ui/Text";
// import { Surface } from "@/components/ui/Surface";
// import { AuthButtons } from "@/components/ui/authButtons";
// import { useTheme } from "react-native-paper";
// import { useToast } from "@/components/Toast/Toast";
// import { useTranslation } from "react-i18next";
// import { api } from "@packages/backend/convex/_generated/api";
// import { useQuery, useAction, useMutation } from "convex/react";
// import { lemonSqueezyStoreId } from "@packages/ui";
// export const useRegisterCustomer = () => {
//   const registerAction = useAction(api.lemonsqueezy.registerUserInLemonSqueezy);

//   return async () => {
//     const result = await registerAction();
//     // console.log("Lemon ID:", result.lemonId);
//   };
// }
import { useAction } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setLemonId } from '@/store/userSlice';
import { useToast } from '@/components/Toast/Toast';
import { useTranslation } from 'react-i18next';
import { router } from "expo-router";

export const useRegisterAndNavigate = () => {
  const [loading, setLoading] = useState(false);
  const lemonId = useSelector((state: RootState) => state.user.lemonId);
  const { user } = useUser();
  const dispatch = useDispatch();
  const toaster = useToast();
  const { t } = useTranslation();

  const registerUserAction = useAction(
    api.lemonsqueezy.registerUserInLemonSqueezy,
  );
  const { isSignedIn, sessionId } = useAuth();

  const registerUser = async () => {
    if (!user) return;
    // Вызываем Convex Action, которая:
    // - Проверяет, зарегистрирован ли пользователь (по tokenIdentifier)
    // - Если нет, вызывает createCustomer у LemonSqueezy и сохраняет lemonId в базе
    const result = await registerUserAction();
    // console.log("result: ", result);
    // if(result )
    return result; // result: { lemonId: string } | null
    // const result = await registerUserAction();
    // return result;
  };

  useEffect(() => {
    if (isSignedIn && sessionId) {
      setLoading(true);
      registerUser()
        .then((data) => {
          if (data && data.lemonId) {
            dispatch(setLemonId(data.lemonId));
          }
        })
        .catch((error) => {
          toaster.show({
            type: "error",
            message: t("auth.registrationError"),
          });
          console.error("Registration error:", error);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isSignedIn, sessionId]);

  // Эффект для навигации, когда lemonId обновляется в сторе
  useEffect(() => {
    if (lemonId) {
      router.push("/notesDashboard");
    }
  }, [lemonId]);
  return loading
};

// export const useRegisterUserInLemonSqueezy = () => {
//   const { user } = useUser();
//   const registerUserAction = useAction(api.lemonsqueezy.registerUserInLemonSqueezy);

//   return async () => {
//     if (!user) return;
//     // Вызываем Convex Action, которая:
//     // - Проверяет, зарегистрирован ли пользователь (по tokenIdentifier)
//     // - Если нет, вызывает createCustomer у LemonSqueezy и сохраняет lemonId в базе
//     const result = await registerUserAction();
//     console.log('result: ', result);
//     // if(result )
//     return result; // result: { lemonId: string } | null
//   };
// };
