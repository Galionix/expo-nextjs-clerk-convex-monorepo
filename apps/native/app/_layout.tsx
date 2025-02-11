// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }

import { Stack } from "expo-router";
import { View, StatusBar, Platform } from "react-native";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import ConvexClientProvider from '@/constants/ConvexClientProvider';

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

  if (!loaded) {
    return null;
  }

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 50 : StatusBar.currentHeight;

  return (
    <ConvexClientProvider>
      <View style={{ flex: 1 }}>
        {/* Статус-бар */}
        <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: "#0D87E1" }}>
          <StatusBar translucent backgroundColor={"#0D87E1"} barStyle="light-content" />
        </View>

        {/* Expo Router автоматически подключит роутинг */}
        {/* <Stack /> */}
        <Stack screenOptions={{ headerShown: false }} />
        {/* <Stack>
          <Stack.Screen name="notesDashboard" options={{ headerShown: false }} />
        </Stack> */}
      </View>
    </ConvexClientProvider>
  );
}
