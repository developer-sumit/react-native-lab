import React from "react";
import { View, Text, Linking, TouchableOpacity, Image } from "react-native";

const HomeScreen: React.FC = () => {
  const openNPMPackage = () => {
    Linking.openURL("https://npmjs.com/package/react-native-lab");
  };
  const openGitHubRepo = () => {
    Linking.openURL("https://github.com/developer-sumit/react-native-lab");
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          rowGap: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#edf2f4",
        }}
      >
        <Text style={{ fontSize: 20 }}>React Native Lab</Text>

        <View style={{ flexDirection: "row", columnGap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openGitHubRepo}
            style={{
              elevation: 7,
              padding: 10,
              columnGap: 10,
              borderRadius: 10,
              flexDirection: "row",
              borderColor: "#121212",
              backgroundColor: "white",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 400 }}>View on</Text>
            <Image
              source={require("../assets/github.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openNPMPackage}
            style={{
              elevation: 7,
              padding: 10,
              columnGap: 10,
              borderRadius: 10,
              flexDirection: "row",
              borderColor: "#121212",
              backgroundColor: "white",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 400 }}>View on</Text>
            <Image
              source={require("../assets/npm.png")}
              style={{ width: 50, height: 30 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          padding: 20,
          paddingBottom: 40,
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#888" }}>Created by</Text>
        <Text style={{ color: "#006d77", fontSize: 20, fontWeight: 500 }}>
          Sumit Singh Rathore
        </Text>
      </View>
    </View>
  );
};

export default HomeScreen;
