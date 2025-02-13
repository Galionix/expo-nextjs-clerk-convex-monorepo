import React from "react";
import { View, StyleSheet } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { Card, useTheme } from "react-native-paper";
import { Button } from "./ui/Button";

export const SkeletonCard = () => {
  const theme = useTheme();
  console.log("theme.colors.secondary: ", theme.colors.secondary);
  return (
    <Card style={[styles.card]}>
      <Card.Content>
        <ContentLoader
          speed={2}
          width={"100%"}
          height={100}
          viewBox="0 0 400 100"
          backgroundColor={theme.colors.background}
          foregroundColor={theme.colors.onBackground}
        >
          <Rect x="10" y="5" rx="5" ry="5" width="70%" height="20" />
          <Rect x="10" y="35" rx="5" ry="5" width="90%" height="15" />
          <Rect x="10" y="55" rx="5" ry="5" width="30%" height="15" />

        </ContentLoader>
      </Card.Content>

      <Card.Actions>
        <Button
          mode="contained"
          style={{
            width: 100,
          }}
        >
          {""}
        </Button>
      </Card.Actions>
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
    // borderColor: "#0D87E1",
  },
  price: {
    marginTop: 10,
    fontWeight: "bold",
  },
  activeText: {
    // color: "#0D87E1",
    fontWeight: "bold",
    marginBottom: 5,
  },
});
