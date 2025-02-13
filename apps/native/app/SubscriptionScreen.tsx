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

export default function SubscriptionScreen() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<ListProducts["data"] | null>(null);
  const [userSubscriptions, setUserSubscriptions] =
    useState<ListSubscriptions | null>(null);
  const [loading, setLoading] = useState(true);
  const wtfProducts = useAction(api.lemonsqueezy.getLemonProducts);
  const getUser = useAction(api.lemonsqueezy.getLemonSubscriptions);

  console.log("ListSubscriptions : ", userSubscriptions);
  useEffect(() => {
    async function loadProducts() {
      const data = await wtfProducts();
      if (data) setProducts(data.data);
      const res = await getUser();
      if (res) setUserSubscriptions(res);
      setLoading(false);
    }
    loadProducts();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <Surface>
      <H1>{t("payment.selectYourPlan")}</H1>
      <ScrollView>
        {products && products.length > 0 ? (
          products.map((product) => {
            const isActive =
              userSubscriptions &&
              userSubscriptions.data.find((sub) => {
                console.log(
                  "sub.attributes.product_id: ",
                  sub.attributes.product_id,
                );
                console.log("product.id: ", product.id);
                console.log(
                  "sub.attributes.product_id === parseInt(product.id, 10): ",
                  sub.attributes.product_id === parseInt(product.id, 10),
                );
                return sub.attributes.product_id === parseInt(product.id, 10);
              });
            return (
              <ProductCard
                key={product.id}
                product={product}
                    // active={!!isActive}
                    subData={isActive}
                // subscriptionId={isActive?.id}
                // cancelled={isActive?.attributes.cancelled}
              />
            );
          })
        ) : (
          <Text>{t("payment.noProductsAvailable")}</Text>
        )}
      </ScrollView>
    </Surface>
  );
}
