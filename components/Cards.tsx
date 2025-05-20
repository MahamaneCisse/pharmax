import icons from "@/constants/icons";
import images from "@/constants/images";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { Models } from "react-native-appwrite";
import React from "react";

interface Props {
  item: Models.Document & { distance?: number };
  onPress?: () => void;
}

export const PharmacieCard = ({
  item: { horaire, name, ville, quartier, rue, porte, contact, distance },
  onPress,
}: Props) => {
  const numero = contact;
  const appeler = () => {
    if (numero) Linking.openURL(`tel:${numero}`);
  };

  const openInMaps = () => {
    if (ville) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        name + ", " + ville
      )}`;
      Linking.openURL(url);
    }
  };

  const adressePrincipale = [ville, quartier].filter(Boolean).join(", ");
  const adresseSecondaire = [rue && `Rue: ${rue}`, porte && `Porte: ${porte}`]
    .filter(Boolean)
    .join(" | ");

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center w-full bg-white rounded-2xl shadow-md p-4 gap-4"
    >
      {/* Logo */}
      <View className="w-20 h-20 rounded-full border-2 border-white overflow-hidden justify-center items-center bg-gray-100">
        <Image
          source={images.logoPharm}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Contenu principal */}
      <View className="flex-1">
        <Text className="text-xl font-semibold text-gray-900">{name}</Text>

        <View className="mt-1 space-y-0.5">
          <Text className="text-gray-700">{adressePrincipale}</Text>
          <Text className="text-gray-600 text-sm">{adresseSecondaire}</Text>
        </View>

        {horaire && (
          <View className="mt-2 flex-row items-center">
            <Image source={icons.horloge} className="w-4 h-4 mr-1" />
            <Text className="text-sm text-green-600 font-medium">
              {horaire}
            </Text>
          </View>
        )}

        {distance !== undefined && (
          <View className="mt-2 flex-row items-center gap-1">
            <Image
              source={icons.location}
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text className="mt-1 text-xs text-gray-500">
              À environ {distance.toFixed(1)} km
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="justify-between h-20">
        <TouchableOpacity className="p-2" onPress={appeler}>
          <Image
            source={icons.phone}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity className="p-2" onPress={openInMaps}>
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
