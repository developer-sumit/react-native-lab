import React from "react";
import { View, Text } from "react-native";

const AboutScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#edf2f4" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 40,
            fontWeight: 500,
            color: "#0077b6",
          }}
        >
          Thanks
        </Text>
        <Text style={{ fontSize: 22, color: "#22223b", textAlign: "center" }}>
          for using react-native-lab ☺️
        </Text>
      </View>
      <Text style={{ marginBottom: 30, color: "#22223b", textAlign: "center" }}>
        Happy Coding! 🚀
      </Text>
    </View>
  );
};

export default AboutScreen;
