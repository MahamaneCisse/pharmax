import icons from "@/constants/icons";
import images from "@/constants/images";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Models } from "react-native-appwrite";
import React from "react";

interface Props {
  item: Models.Document;
  onPress?: () => void;
}

export const FeaturedCard = ({
  item: { horaire, name, ville, quartier, rue, porte },
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center w-full bg-green-400 rounded-2xl shadow-md p-4  gap-4"
    >
      {/* Logo */}
      <View className="w-20 h-20 rounded-full border-2 border-green-500 overflow-hidden justify-center items-center">
        <Image
          source={images.logoPharm}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        {/* Header */}
        <Text className="text-xl font-semibold text-gray-900">{name}</Text>

        {/* Address */}
        <View className="mt-1 space-y-0.5">
          <Text className="text-gray-700">
            {ville}, {quartier}
          </Text>
          <Text className="text-gray-600 text-sm">
            Rue: {rue} | Porte: {porte}
          </Text>
        </View>

        {/* Horaire */}
        <Text className="mt-2 text-sm text-green-600 font-medium">
          <View>
            <Image source={icons.horloge} className="size-4 mr-2" />
          </View>
          {horaire}
        </Text>
      </View>

      {/* Actions */}
      <View className="justify-between h-20">
        <TouchableOpacity className="p-2">
          <Image
            source={icons.phone}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <Image
            source={icons.location}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
