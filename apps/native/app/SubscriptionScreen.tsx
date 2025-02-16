import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
// import { fetchProducts } from "../api";
// import { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { Text } from "react-native-paper";
import {
  lemonSqueezySetup,
  getAuthenticatedUser,
  listProducts,
  ListProducts,
  User,
  ListSubscriptionInvoices,
  ListSubscriptions,
} from "@lemonsqueezy/lemonsqueezy.js";
import { useQuery, useAction } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Surface } from "../components/ui/Surface";
import { useTranslation } from "react-i18next";
import { H1 } from "../components/ui/Text";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useCustomerData } from '@/hooks/useCustomerData';
import { useSelector } from 'react-redux';
import { selectActiveSubscriptions } from '@/store/selectors/activeSubscriptions';

import * as WebBrowser from "expo-web-browser";

import * as Linking from "expo-linking";
import { useDeepLinkHandler } from '@/utils/browserUtils';

async function openCheckout(url: string) {
  try {
    const result = await InAppBrowser.openAuthSessionAsync(url, "myapp://notesDashboard");
    if (result.type === "success" && result.url) {
      // Обработка успешного возврата
      const { queryParams } = Linking.parse(result.url);
      if (queryParams.success === "true") {
        // Навигация на notesDashboard и обновление данных
        router.push("/notesDashboard");
      }
    }
  } catch (error) {
    console.error("InAppBrowser error:", error);
  }
}
export default function SubscriptionScreen() {

  const [result, setResult] = useState(null);
  console.log('result: ', result);

  const _handlePressButtonAsync = async (link: string) => {
    let result = await WebBrowser.openAuthSessionAsync(link, "myapp://notesDashboard");
    setResult(result);
  };
  useDeepLinkHandler();
  const { t } = useTranslation();
  const [products, setProducts] = useState<ListProducts["data"] | null>(null);
  const [userSubscriptions, setUserSubscriptions] =
    useState<ListSubscriptions | null>(null);
  const [loading, setLoading] = useState(true);
  const wtfProducts = useAction(api.lemon.getLemonProducts.getLemonProducts);
  const { loading: customerDataLoading, customerData, refetch } = useCustomerData();
  console.log('customerData: ', customerData);
  console.log('customerData: ', customerData?.data.relationships.subscriptions.data);
  // const getSubscribtions = useAction(api.lemonsqueezy.getLemonSubscriptions);
  // const getUser = useAction(api.lemonsqueezy.getLemonUser);
  const activeSubscriptions = useSelector(selectActiveSubscriptions)

  console.log("ListSubscriptions : ", userSubscriptions);
  useEffect(() => {
    async function loadProducts() {
      const data = await wtfProducts();
      if (data) setProducts(data.data);
      // const res = await getSubscribtions();
        // if (res) setUserSubscriptions(res);
        // const user = await getUser()
        // console.log('!!!!!!!!!!!!!!!!!!!!!!!user: ', user);
      setLoading(false);
    }
    loadProducts();
    refetch()
  }, []);

  //   if (loading)
  //     return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <Surface>
      <H1>{t("payment.selectYourPlan")}</H1>
      <ScrollView>
        {!loading && products && products.length > 0
          ? products.map((product) => {
            const subData = activeSubscriptions.find(sub =>
              // sub.attributes.variant_id === parseInt(product., 10) &&
              sub.attributes.product_id === parseInt(product.id, 10)
            )
              // // const isActive =
              // //   userSubscriptions &&
              // //   userSubscriptions.data.find((sub) => {
              // //     console.log(
              // //       "sub.attributes.product_id: ",
              // //       sub.attributes.product_id,
              // //     );
              //     console.log("product.id: ", product.id);
              //     console.log(
              //       "sub.attributes.product_id === parseInt(product.id, 10): ",
              //       sub.attributes.product_id === parseInt(product.id, 10),
              //     );
              //     return sub.attributes.product_id === parseInt(product.id, 10);
                // });
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  // active={!!isActive}
                  subData={subData}
                  onPress={_handlePressButtonAsync}
                  // subscriptionId={isActive?.id}
                  // cancelled={isActive?.attributes.cancelled}
                />
              );
            })
          : !loading && <Text>{t("payment.noProductsAvailable")}</Text>}
        {loading && (
          <>
            <SkeletonCard key="1" />
            <SkeletonCard key="2" />
          </>
        )}
      </ScrollView>
    </Surface>
  );
}
