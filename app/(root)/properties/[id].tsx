import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import icons from "@/constants/icons";
import images from "@/constants/images";
import MapView, { Marker } from "react-native-maps";

import { useAppwrite } from "@/lib/useAppwrite";
import { getPharmaciesById } from "@/lib/appwrite";
import Loader from "@/components/Loader";
const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const windowHeight = Dimensions.get("window").height;

  const { data: property } = useAppwrite({
    fn: getPharmaciesById,
    params: {
      id: id!,
    },
  });

  const openInMaps = () => {
    if (property?.latitude && property?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
      Linking.openURL(url);
    }
  };
  if (!property) {
    return <Loader />;
  }

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={images.local}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image
                  source={icons.phone}
                  className="size-7"
                  tintColor={"#191D31"}
                />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">
            Pharmacie {property?.name}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                Rue: {property?.rue}
              </Text>
            </View>
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                Porte: {property?.porte}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <Text className="text-black-200 text-sm mt-1 font-rubik-medium">
                Note: {property?.notation}/5
              </Text>
              <Image source={icons.star} className="size-5" />
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Apropos
            </Text>
            <Text className="text-black-200 text-base font-rubik mt-2">
              {property?.apropos}
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Localisation
            </Text>
            <View className="flex flex-row items-center justify-start mt-4 gap-2">
              <Image source={icons.location} className="w-7 h-7" />
              <Text className="text-black-200 text-sm font-rubik-medium">
                {property?.quartier}, {property?.ville}
              </Text>
            </View>

            {/* Carte avec marker vert */}
            <MapView
              style={{
                height: 200,
                width: "100%",
                borderRadius: 12,
                marginTop: 20,
              }}
              initialRegion={{
                latitude: property?.latitude ?? 0,
                longitude: property?.longitude ?? 0,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: property?.latitude ?? 0,
                  longitude: property?.longitude ?? 0,
                }}
                title={property?.name || "Pharmacie"}
                pinColor="green"
              />
            </MapView>
          </View>
          <TouchableOpacity
            onPress={openInMaps}
            className="mt-4 bg-black px-4 py-2 rounded-full"
          >
            <Text className="text-white text-center font-rubik-bold">
              Ouvrir l’itinéraire dans Google Maps
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Property;
