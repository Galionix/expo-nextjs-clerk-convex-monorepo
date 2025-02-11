// unused
// import { useSSO } from '@clerk/clerk-expo';
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView } from "react-native";
export default function SSOCallbackScreen(params2) {
    // const { startSSOFlow } = useSSO()
    const params = useLocalSearchParams(); // Получаем параметры из URL

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>SSO Callback</Text>
      <Text style={{ fontSize: 14, marginTop: 10 }}>Переданные параметры:</Text>
      <Text style={{ fontSize: 12, color: "blue", marginTop: 10 }}>
        {JSON.stringify(params, null, 2)}
      </Text>
      <Text style={{ fontSize: 14, marginTop: 10 }}>params2</Text>
      <Text style={{ fontSize: 12, color: "blue", marginTop: 10 }}>
        {JSON.stringify(params2, null, 2)}
      </Text>
    </ScrollView>
  );
}
