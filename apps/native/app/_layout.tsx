import { PaperProvider } from "react-native-paper";
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
import { tokenCache } from "@/cache";
import { P } from '@/components/ui/Text';
// import { myColor } from '@packages/ui';
export default function RootLayout() {
  // Отключаем логи Expo (как в старом App.tsx)
  // LogBox.ignoreLogs(["Warning: ..."]);
  // LogBox.ignoreAllLogs();

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
    // <ClerkProvider tokenCache={tokenCache}>
    <ConvexClientProvider>
      <ClerkLoaded>
        <PaperProvider theme={paperTheme}>
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
            {/* Expo Router автоматически подключит роутинг */}
            {/* <Stack /> */}
            <Stack screenOptions={{ headerShown: false }} />
            {/* <Stack>
          <Stack.Screen name="notesDashboard" options={{ headerShown: false }} />
          </Stack> */}
          </Surface>
        </PaperProvider>
      </ClerkLoaded>
    </ConvexClientProvider>
    // </ClerkProvider>
  );
}
