import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import icons from "@/constants/icons";
import Search from "@/components/Search";
import NoResults from "@/components/NoResults";
import { FeaturedCard } from "@/components/Cards";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { getLatestPharmacies, getPharmacies } from "@/lib/appwrite";

const Index = () => {
  const { user } = useGlobalContext();
  const numero = "+223 80 00 12 11";
  const appeler = () => {
    Linking.openURL(`tel:${numero}`);
  };

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: latestPharmacies, loading: latestPharmaciesLoading } =
    useAppwrite({
      fn: getLatestPharmacies,
    });

  const {
    data: pharmacies,
    refetch,
    loading,
  } = useAppwrite({
    fn: getPharmacies,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={[]}
        numColumns={2}
        renderItem={({ item }) => null}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full"
                />

                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Bonjour
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {user?.name}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={appeler}>
                <Image
                  source={icons.appel_durgence}
                  style={{ width: 24, height: 24 }}
                  alt="Appel d'urgence"
                />
              </TouchableOpacity>
              <Image source={icons.bell} className="size-6" />
            </View>
            <View className="w-full mt-3 flex justify-center items-center">
              <Text className="text-4xl font-rubik-extrabold text-black">
                PHARMA<Text className="text-primary-100">X</Text>
              </Text>
            </View>

            <Search />

            <View className="my-5">
              <FlatList
                data={latestPharmacies}
                renderItem={({ item }) => (
                  <FeaturedCard
                    item={item}
                    onPress={() => handleCardPress(item.$id)}
                  />
                )}
                keyExtractor={(item) => item.$id}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex flex-col mt-5"
                className="gap-5"
                ListEmptyComponent={
                  loading ? (
                    <ActivityIndicator
                      size="large"
                      className="text-primary-300 mt-5"
                    />
                  ) : (
                    <NoResults />
                  )
                }
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
export default Index;
