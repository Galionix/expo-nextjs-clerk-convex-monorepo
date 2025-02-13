import { useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Avatar as PaperAvatar, Menu, Button } from "react-native-paper";
import { tokenCache } from "@/cache";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

type AvatarProps = {
  menuStyle?: StyleProp<ViewStyle>;
};

const defaultMenuStyle = { transform: [{ translateY: 40 }] };
export const Avatar = ({ menuStyle = defaultMenuStyle }: AvatarProps) => {
  const router = useRouter();

  const auth = useAuth();
  const [visible, setVisible] = useState(false);
//   const { signOut } = useAuth();
  const user = useUser();
    const imageUrl = user?.user?.imageUrl;
    const { t } = useTranslation();

    const onExit = () => {
        // tokenCache && "clearToken" in tokenCache &&
        auth.signOut()
        if (tokenCache && tokenCache.clearToken) {
            tokenCache.clearToken('__clerk_client_jwt')
        }
    }
  return (
    <View
      style={{ position: "relative" }}
      // onPress={() => setVisible(true)}
    >
      {/* Точка привязки меню */}
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setVisible(true)}>
            <PaperAvatar.Image size={40} source={{ uri: imageUrl }} />
          </TouchableOpacity>
        }
        style={menuStyle} // Смещение вниз
      >
        {/* <Menu.Item
          key="setting"
          onPress={() => console.log("Открываем настройки")}
          title={t('user.settings')}
        /> */}
        <Menu.Item
          key='subscriptions'
          title={t('user.subscriptionsManagem')}
          onPress={() => {
            setVisible(false)
            router.push("/SubscriptionScreen")
          }}
        ></Menu.Item>
        <Menu.Item key="exit" onPress={() => onExit()} title={t('user.signOut')} />
      </Menu>
    </View>
  );
};
