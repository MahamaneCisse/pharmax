import { SplashScreen, Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import React, { useEffect } from "react";

import icons from "@/constants/icons";
import { useFonts } from "expo-font";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => (
  <View className={`flex-1 mt-3 flex flex-col items-center }`}>
    <Image
      source={icon}
      tintColor={focused ? "#16db65" : "#666876"}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${
        focused
          ? "text-primary-300 font-rubik-medium"
          : "text-black-200 font-rubik"
      } text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  const [fontsLoaded] = useFonts({
    "rubik-regular": require("@/assets/fonts/Rubik-Regular.ttf"),
    "rubik-medium": require("@/assets/fonts/Rubik-Medium.ttf"),
    "rubik-bold": require("@/assets/fonts/Rubik-Bold.ttf"),
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      console.log(fontsLoaded);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          position: "absolute",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          minHeight: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Accueil" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorer",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Explorer" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
