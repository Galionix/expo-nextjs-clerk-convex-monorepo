import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  // Text,
  // TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery, useAction } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Surface } from "@/components/ui/Surface";
import { P } from "@/components/ui/Text";
import { TextInput } from "react-native-paper";
import { AnimatedFAB } from "react-native-paper";
import { debugStyle } from "@/constants/utils";
import { Button } from "@/components/ui/Button";
import * as SecureStore from "expo-secure-store";
import { Avatar } from "@/components/Avatar/Avatar";
import { useTranslation } from "react-i18next";

// type NoteType = ReturnType<typeof api.notes.getNotes>
const NotesDashboardScreen = () => {
  const router = useRouter();
  const auth = useAuth();
  const [isExtended, setIsExtended] = React.useState(true);
  const { t } = useTranslation();
  const isIOS = Platform.OS === "ios";

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  // const fabStyle = { [animateFrom]: 16 };
  const user = useUser();
  // console.log("user: ", user);
  const imageUrl = user?.user?.imageUrl;
  const firstName = user?.user?.firstName;

  const allNotes = useQuery(api.notes.getNotes);
  const wtfProducts = useAction(api.lemonsqueezy.getLemonProducts);
  // console.log('wtfProducts: ', wtfProducts);
  // console.log("allNotes: ", allNotes);
  const [search, setSearch] = useState("");

  const finalNotes =
    search && allNotes
      ? allNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase()),
        )
      : allNotes;
  useEffect(() => {
    if (!user.isSignedIn) {
      router.replace("/login");
    }
  }, [user]);
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/insideNote", // Указываем путь к странице
          params: {
            title: item.title,
            content: item.content,
            summary: item.summary || "No summary available",
          },
        })
      }
      activeOpacity={0.5}
      style={styles.noteItem}
    >
      <P style={styles.noteText}>{item.title}</P>
    </TouchableOpacity>
  );

  return (
    <Surface style={styles.container}>
      <SafeAreaView>
        {/* <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")} // Replace with your logo image file
          style={styles.logo}
        />
      </View> */}

        <View style={styles.yourNotesContainer}>
          {/* @ts-ignore, for css purposes */}
          <Image style={styles.avatarSmall} />
          <P>{t("dashboard.yourNotes")}</P>
          <Avatar />
          {/* {imageUrl ? (
            // <Image style={styles.avatarSmall} source={{ uri: imageUrl }} />
            <Avatar.Image size={24} source={{ uri: imageUrl }} />
          ) : (
            <P>{firstName ? firstName : ""}</P>
          )} */}
        </View>
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={20}
            color="grey"
            // style={styles.searchIcon}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            // style={styles.searchInput}
          />
        </View>
        {!finalNotes || finalNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <P style={styles.emptyStateText}>
              Create your first note to{"\n"}get started
            </P>
          </View>
        ) : (
          <ScrollView onScroll={onScroll}>
            {finalNotes.map((item) => (
              <P key={item._id}>{item.title}</P>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
      <Button
        onPress={() => router.push("/SubscriptionScreen")}
        // onPress={async () => {
        //   const res = await wtfProducts();
        //   console.log("res: ", res);
        // }}
      >
        Emit products
      </Button>

      <AnimatedFAB
        icon={"plus"}
        label={"Label"}
        extended={false}
        onPress={() => router.push("/createNote")}
        animateFrom={"right"}
        iconMode={"static"}
        style={styles.fab}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // ...debugStyle
    // backgroundColor: "white",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 50,
  },
});

export default NotesDashboardScreen;
