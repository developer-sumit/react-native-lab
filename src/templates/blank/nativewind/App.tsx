import "./global.css";

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
    { name: "nativewind", description: "Utility library for React Native" },
  ];

  const openGitHubRepo = () => {
    Linking.openURL("https://github.com/developer-sumit/react-native-lab");
  };

  return (
    <View className="flex-1 bg-[#edf2f4]">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openGitHubRepo}
        className="absolute p-2.5 right-6 bottom-10 z-[1] border rounded-full border-[#121212] bg-white"
      >
        <Image source={require("./assets/github.png")} className="w-8 h-8" />
      </TouchableOpacity>

      <View className="flex-1">
        <Text className="p-5 text-center text-3xl font-semibold">
          {pkg.name
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())}
        </Text>

        <ScrollView
          className="flex-1 overflow-hidden rounded-tr-2xl rounded-tl-2xl"
          contentContainerClassName="p-5 gap-y-5"
        >
          <Text className="text-xl">
            This is a simple React Native project setup using{" "}
            <Text className="text-[#0FA1C9] font-medium">
              react-native-lab.
            </Text>
          </Text>

          <View className="rounded-2xl overflow-hidden bg-white border border-[#f1f1f1] border-l-[#ddd]">
            <Image
              source={require("./assets/banner.jpg")}
              className="w-full h-[150px]"
            />
          </View>

          <View className="gap-x-2 mt-4">
            <Text className="text-xl">
              This cli tool adds a bunch of useful libraries and tools to your
              project which are not included in the default React Native CLI.
            </Text>
            <View>
              {includedPackages.map((pkg, index) => (
                <View key={index} className="p-4 rounded-xl my-2 bg-white">
                  <Text className="text-lg font-medium">{pkg.name}</Text>
                  <Text className="text-base">{pkg.description}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text className="text-lg text-[#888] text-center">
            If you have any suggestions or feedback, feel free to open an issue
            on GitHub
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default App;
