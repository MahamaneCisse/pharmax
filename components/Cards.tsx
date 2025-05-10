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
      className="flex flex-row items-start justify-between w-full h-44 relative py-1 bg-gray-200 rounded-lg overflow-hidden shadow-xl shadow-black"
    >
      <View className="h-full w-1/3 border-r border-gray-800">
        <View className="flex justify-center items-center w-full h-1/2">
          <View className="bg-transparent w-20 h-20 rounded-full border-2 border-green-600">
            <Image
              source={images.logoPharm}
              className="w-full h-full rounded-full"
              resizeMode="contain"
            />
          </View>
        </View>
        <View className="flex justify-center items-center w-full h-1/2">
          <View className="w-full h-full flex justify-center items-center">
            <Text>Horaire</Text>
            <Text>{horaire}</Text>
          </View>
        </View>
      </View>
      <View className="h-full w-2/3 px-1 py-1">
        <View className="w-full h-1/3 flex justify-center items-center border-b border-gray-800">
          <Text className="font-rubik text-lg font-bold">{name}</Text>
        </View>
        <View className="w-full h-2/3 flex flex-row">
          <View className="w-3/4 px-2 pt-1 border-r border-gray-700">
            <Text className="font-rubik-bold">{ville}</Text>
            <Text className="font-rubik-bold">{quartier}</Text>
            <Text className="font-rubik-bold">Rue: {rue}</Text>
            <Text className="font-rubik-bold">Porte: {porte}</Text>
          </View>
          <View className="bg- w-1/4 h-full">
            <View className="w-full h-1/2 border-b border-gray-800">
              <TouchableOpacity className="w-full h-full flex justify-center items-center">
                <Image
                  source={icons.phone}
                  className="w-1/2 h-full"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View className="w-full h-1/2">
              <TouchableOpacity className="w-full h-full flex justify-center items-center">
                <Image
                  source={icons.location}
                  className="w-1/2 h-full"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
