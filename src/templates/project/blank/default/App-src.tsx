import React from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import pkg from "./package.json";

const App: React.FC = () => {
  const includedPackages = [
    {
      name: "react-native-dotenv",
      description: "React Native component that handles environment variables",
    },
    {
      name: "babel-plugin-module-resolver",
      description: "Babel plugin to add module resolver",
    },
  ];

  const openGitHubRepo = () => {
    Linking.openURL(
      "https://github.com/developer-sumit/react-native-lab"
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#edf2f4" }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openGitHubRepo}
        style={{
          elevation: 7,
          position: "absolute",
          padding: 10,
          right: 25,
          bottom: 40,
          zIndex: 100,
          borderWidth: 1,
          borderRadius: 100,
          borderColor: "#121212",
          backgroundColor: "white",
        }}
      >
        <Image
          source={require("./src/assets/github.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            padding: 20,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          {pkg.name
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())}
        </Text>

        <ScrollView
          contentContainerStyle={{ padding: 20, rowGap: 20 }}
          style={{
            flex: 1,
            overflow: "hidden",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <Text style={{ fontSize: 20 }}>
            This is a simple React Native project setup using{" "}
            <Text style={{ color: "#0FA1C9", fontWeight: 500 }}>
              react-native-lab.
            </Text>
          </Text>

          <View
            style={{
              width: "100%",
              borderRadius: 14,
              borderWidth: 0.8,
              borderColor: "#f1f1f1",
              borderStartColor: "#ddd",
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <Image
              source={require("./src/assets/banner.jpg")}
              style={{ width: "100%", height: 150 }}
            />
          </View>

          <View style={{ rowGap: 7, marginTop: 15 }}>
            <Text style={{ fontSize: 20 }}>
              This cli tool adds a bunch of useful libraries and tools to your
              project which are not included in the default React Native CLI.
            </Text>
            <View>
              {includedPackages.map((pkg, index) => (
                <View
                  key={index}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    marginVertical: 5,
                    backgroundColor: "white",
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: 500 }}>
                    {pkg.name}
                  </Text>
                  <Text style={{ fontSize: 16 }}>{pkg.description}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={{ fontSize: 18, color: "#888", textAlign: "center" }}>
            If you have any suggestions or feedback, feel free to open an issue
            on GitHub
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default App;
