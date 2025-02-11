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
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Surface } from "@/components/ui/Surface";
import { P } from "@/components/ui/Text";
import { Avatar, TextInput } from "react-native-paper";
import { AnimatedFAB } from "react-native-paper";
import { debugStyle } from "@/constants/utils";
import { Button } from "@/components/ui/Button";
import * as SecureStore from 'expo-secure-store'

// type NoteType = ReturnType<typeof api.notes.getNotes>
const NotesDashboardScreen = () => {
  const router = useRouter();
  const auth = useAuth();
  const [isExtended, setIsExtended] = React.useState(true);

  const isIOS = Platform.OS === "ios";

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  // const fabStyle = { [animateFrom]: 16 };
  const user = useUser();
  console.log("user: ", user);
  const imageUrl = user?.user?.imageUrl;
  const firstName = user?.user?.firstName;

  const allNotes = useQuery(api.notes.getNotes);
  console.log("allNotes: ", allNotes);
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
          <P>Your Notes</P>
          {imageUrl ? (
            // <Image style={styles.avatarSmall} source={{ uri: imageUrl }} />
            <Avatar.Image size={24} source={{ uri: imageUrl }} />
          ) : (
            <P>{firstName ? firstName : ""}</P>
          )}
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
              <P>{item.title}</P>
            ))}
          </ScrollView>
          // <FlatList
          //   data={finalNotes}
          //   renderItem={renderItem}
          //   keyExtractor={(item) => item._id}
          //   style={styles.notesList}
          //   contentContainerStyle={{
          //     marginTop: 19,
          //     borderTopWidth: 0.5,
          //     borderTopColor: "rgba(0, 0, 0, 0.59)",
          //   }}
          // />
        )}

        {/* <AnimatedFAB
        onPress={() => router.push("/createNote")}
        style={styles.newNoteButton}
      >
        <AntDesign name="pluscircle" size={20} color="#fff" />
        <P style={styles.newNoteButtonText}>Create a New Note</P>
      </AnimatedFAB> */}
      </SafeAreaView>
      <Button onPress={async () => {
        await SecureStore.deleteItemAsync('__clerk_client_jwt')
        auth.signOut()
      }}>Sign Out</Button>
      <AnimatedFAB
        icon={"plus"}
        label={"Label"}
        extended={false}
        onPress={() => router.push("/createNote")}
        // visible={visible}
        animateFrom={"right"}
        iconMode={"static"}
        style={styles.fab}
        // style={[styles.fabStyle, style, fabStyle]}
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
  // header: {
  //   // backgroundColor: "#0D87E1",
  //   height: 67,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // logo: {
  //   width: 46,
  //   height: 46,
  //   borderRadius: 20,
  //   resizeMode: "contain",
  // },
  // title: {
  //   fontSize: RFValue(17.5),
  //   fontFamily: "MMedium",
  //   alignSelf: "center",
  // },
  // yourNotesContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   paddingHorizontal: 13,
  //   marginTop: 19,
  // },
  // avatarSmall: {
  //   width: 28,
  //   height: 28,
  //   borderRadius: 10,
  // },
  // searchContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   borderWidth: 1,
  //   borderColor: "grey",
  //   borderRadius: 10,
  //   padding: 10,
  //   marginHorizontal: 15,
  //   marginTop: 30,
  // },
  // searchIcon: {
  //   marginRight: 10,
  // },
  // searchInput: {
  //   flex: 1,
  //   fontSize: RFValue(15),
  //   fontFamily: "MRegular",
  //   color: "#2D2D2D",
  // },
  // notesList: {
  //   flex: 1,
  // },
  // noteItem: {
  //   padding: 20,
  //   borderBottomWidth: 0.5,
  //   borderBottomColor: "rgba(0, 0, 0, 0.59)",
  //   backgroundColor: "#F9FAFB",
  // },
  // noteText: {
  //   fontSize: 16,
  //   fontFamily: "MLight",
  //   color: "#2D2D2D",
  // },
  // newNoteButton: {
  //   flexDirection: "row",
  //   backgroundColor: "#0D87E1",
  //   borderRadius: 7,
  //   width: Dimensions.get("window").width / 1.6,
  //   alignSelf: "center",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   minHeight: 44,
  //   position: "absolute",
  //   bottom: 35,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 3,
  //   },
  //   shadowOpacity: 0.27,
  //   shadowRadius: 4.65,
  //   elevation: 6,
  // },
  // newNoteButtonText: {
  //   color: "white",
  //   fontSize: RFValue(15),
  //   fontFamily: "MMedium",
  //   marginLeft: 10,
  // },
  // switchContainer: {
  //   position: "absolute",
  //   top: 20,
  //   right: 20,
  // },
  // emptyStateText: {
  //   textAlign: "center",
  //   alignSelf: "center",
  //   fontSize: RFValue(15),
  //   color: "grey",
  //   fontFamily: "MLight",
  // },
  // emptyState: {
  //   width: "100%",
  //   height: "35%",
  //   marginTop: 19,
  //   backgroundColor: "#F9FAFB",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderWidth: 0.5,
  //   borderColor: "rgba(0, 0, 0, 0.59)",
  // },
});

export default NotesDashboardScreen;
