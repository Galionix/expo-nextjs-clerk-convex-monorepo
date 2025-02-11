import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePathname } from "expo-router";

export default function NotFoundScreen() {
  const pathname = usePathname(); // Получаем путь

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Страница не найдена</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>Вы пытались перейти на:</Text>
      <Text style={{ fontSize: 16, fontWeight: "bold", color: "red" }}>{pathname}</Text>
    </View>
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
