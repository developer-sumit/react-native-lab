import React from "react";
import { View, Text } from "react-native";

const AboutScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-[#edf2f4]">
      <View className="flex-1 items-center justify-center">
        <Text className="text-5xl font-[500] text-[#0077b6]">Thanks</Text>
        <Text className="text-xl text-[#22223b] text-center">
          for using react-native-lab ☺️
        </Text>
      </View>
      <Text className="mb-8 text-[#22223b] text-center">Happy Coding! 🚀</Text>
    </View>
  );
};

export default AboutScreen;
