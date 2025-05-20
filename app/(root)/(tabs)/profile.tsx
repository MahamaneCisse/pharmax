import {
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

import icons from "@/constants/icons";
import { settings } from "@/constants/data";

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between py-4 border-b border-gray-100"
  >
    <View className="flex-row items-center gap-4">
      <Image
        source={icon}
        className="w-6 h-6 opacity-70"
        resizeMode="contain"
      />
      <Text
        className={`text-base font-rubik-regular text-gray-800 ${textStyle}`}
      >
        {title}
      </Text>
    </View>

    {showArrow && (
      <Image
        source={icons.rightArrow}
        className="w-4 h-4 opacity-50"
        resizeMode="contain"
      />
    )}
  </TouchableOpacity>
);

const Profile = () => {
  const { user, refetch } = useGlobalContext();

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Succès", "Déconnexion réussie");
      refetch();
    } else {
      Alert.alert("Erreur", "Erreur lors de la déconnexion");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-6"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-6">
          <Text className="text-2xl font-rubik-bold text-gray-900">
            Mon profil
          </Text>
          <Image source={icons.bell} className="w-5 h-5 opacity-60" />
        </View>

        {/* Avatar */}
        <View className="items-center mt-8">
          <View className="w-40 h-40 rounded-full shadow-md shadow-black/10 overflow-hidden">
            <Image
              source={{ uri: user?.avatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-xl font-rubik-medium mt-4 text-gray-800">
            {user?.name}
          </Text>
        </View>

        {/* Settings */}
        <View className="mt-8">
          {settings.map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        {/* Logout */}
        <View className="mt-8 border-t border-gray-100 pt-4">
          <SettingsItem
            icon={icons.logout}
            title="Déconnexion"
            textStyle="text-red-500 font-rubik-medium"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
