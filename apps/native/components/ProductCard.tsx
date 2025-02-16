import React, { useState } from "react";
import { View, Linking, StyleSheet } from "react-native";
import { Card, Text, Button, Dialog, Portal } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { api } from "@packages/backend/convex/_generated/api";
import { ListProducts, Subscription } from "@lemonsqueezy/lemonsqueezy.js";
import { useAction } from "convex/react";
import { useRouter } from 'expo-router';
import { formatDate, useFormattedDate } from '../utils/dateUtils';
import { useSelector } from 'react-redux';
import { selectActiveSubscriptions } from '@/store/selectors/activeSubscriptions';
import { openCheckout } from '@/utils/browserUtils';

interface ProductCardProps {
    product: ListProducts["data"][0];
  subData?: Subscription["data"] | null
  onPress: (url: string) => void
//   active?: boolean;
//   cancelled?: boolean;
//   subscriptionId?: string; // ID подписки для отмены
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  subData,
  onPress
}) => {
  const router = useRouter();
  // console.log('activeSubscriptions: ', activeSubscriptions);
  const { t } = useTranslation();
  const unsubscribeAction = useAction(api.lemonsqueezy.cancelLemonSubscription);

  // Управление модальным окном
  const [modalVisible, setModalVisible] = useState(false);

  // Функция для отмены подписки
  const handleUnsubscribe = async () => {
    if (subData?.id) {
      await unsubscribeAction({ subscriptionId: subData?.id });
        setModalVisible(false);
        router.push("/notesDashboard");
    }
  };

  return (
    <Card style={[styles.card, !!subData && styles.activeCard]}>
      <Card.Content>
        <Text variant="titleLarge">{product.attributes.name}</Text>

        {!!subData && (
          <Text variant="bodySmall" style={styles.activeText}>
            ✅ {t("payment.ActiveSubscription")}
          </Text>
        )}
        {!!subData && subData.attributes.cancelled && (
          <Text variant="bodySmall" style={styles.activeText}>
            {`❌ ${t("payment.cancelled")}. ${t('payment.validUntil')} ${useFormattedDate(subData.attributes.ends_at)}`}
          </Text>
        )}

        <Text variant="bodyMedium">
          {product.attributes.description.replace(/<\/?[^>]+(>|$)/g, "")}
        </Text>
        <Text variant="titleMedium" style={styles.price}>
          {product.attributes.price_formatted}
        </Text>
      </Card.Content>

      <Card.Actions>
        {!!subData && (
          <Button mode="text" onPress={() => setModalVisible(true)}>
            {t("payment.unsubscribe")}
          </Button>
        )}
        <Button
          mode="contained"
          onPress={() => openCheckout(product.attributes.buy_now_url)}
          disabled={!!subData}
        >
          {!!subData ? t("payment.subscribed") : t("payment.subscribe")}
        </Button>
      </Card.Actions>

      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>{`${t("payment.cancelSubscriptionFo")} ${product.attributes.name}`}</Dialog.Title>
          <Dialog.Content>
            <Text>{t("payment.wereSadToSeeYouGoYou")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setModalVisible(false)}>
              {t("payment.cancel")}
            </Button>
            <Button onPress={handleUnsubscribe}>{t("payment.confirmCancel")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeCard: {
    borderColor: "#0D87E1",
  },
  price: {
    marginTop: 10,
    fontWeight: "bold",
  },
  activeText: {
    color: "#0D87E1",
    fontWeight: "bold",
    marginBottom: 5,
  },
});
