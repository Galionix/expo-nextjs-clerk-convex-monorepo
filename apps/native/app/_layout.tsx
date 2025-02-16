import { PaperProvider, useTheme } from "react-native-paper";
import "intl-pluralrules"; // Полифилл для React Native
import { Stack } from "expo-router";
import { View, StatusBar, Platform, useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import ConvexClientProvider from "@/constants/ConvexClientProvider";
import { darkTheme, lightTheme } from "../constants/theme";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { StyleSheet } from "react-native";
import { Surface } from "@/components/ui/Surface";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import "@packages/i18n"; // Глобальная инициализация
import { P } from "@/components/ui/Text";
import { ToastProvider } from "@/components/Toast/Toast";
import { useTranslation } from "react-i18next";
import { Provider } from "react-redux";
import { store } from "../store";

// import { myColor } from '@packages/ui';
export default function RootLayout() {
  // Отключаем логи Expo (как в старом App.tsx)
  // LogBox.ignoreLogs(["Warning: ..."]);
  // LogBox.ignoreAllLogs();
  const { t, i18n } = useTranslation();
  // Загружаем шрифты (из старого App.tsx)
  const [loaded] = useFonts({
    Bold: require("../assets/fonts/Inter-Bold.ttf"),
    SemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
    Medium: require("../assets/fonts/Inter-Medium.ttf"),
    Regular: require("../assets/fonts/Inter-Regular.ttf"),

    MBold: require("../assets/fonts/Montserrat-Bold.ttf"),
    MSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    MMedium: require("../assets/fonts/Montserrat-Medium.ttf"),
    MRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MLight: require("../assets/fonts/Montserrat-Light.ttf"),
  });
  const colorScheme = useColorScheme();
  console.log("colorScheme: ", colorScheme);
  const { theme } = useMaterial3Theme();

  const paperTheme =
    colorScheme === "dark"
      ? { ...darkTheme, colors: theme.dark }
      : { ...lightTheme, colors: theme.light };
  if (!loaded) {
    return null;
  }

  const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 50 : StatusBar.currentHeight;

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <ConvexClientProvider>
          <ClerkLoaded>
            <PaperProvider theme={paperTheme}>
              <ToastProvider
                overrides={{
                  position: "middle",
                  type: "normal",
                  messageContainerStyle: {
                    width: "auto",
                    backgroundColor: paperTheme.colors.background,
                  },
                  messageStyle: {
                    color: paperTheme.colors.onBackground,
                    width: "auto",
                  },
                  snackbarStyle: {
                    width: "auto",
                    backgroundColor: paperTheme.colors.background,
                  },
                }}
              >
                <Surface>
                  {/* Статус-бар */}
                  <View
                    style={{
                      height: STATUS_BAR_HEIGHT,
                      backgroundColor: paperTheme.colors.background,
                    }}
                  >
                    <StatusBar
                      translucent
                      backgroundColor={paperTheme.colors.background}
                      barStyle="light-content"
                    />
                  </View>
                  <Stack screenOptions={{ headerShown: false }} />
                </Surface>
              </ToastProvider>
            </PaperProvider>
          </ClerkLoaded>
        </ConvexClientProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
