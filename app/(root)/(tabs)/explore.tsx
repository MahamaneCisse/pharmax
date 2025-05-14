import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useDebouncedCallback } from "use-debounce";

import icons from "@/constants/icons";
import Search from "@/components/Search";
import Loader from "@/components/Loader";
import { FeaturedCard } from "@/components/Cards";
import NoResults from "@/components/NoResults";

import { getPharmacies } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";

const Explore = () => {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: pharmacies,
    refetch,
    loading,
  } = useAppwrite({
    fn: getPharmacies,
    params: {
      filter: params.filter!,
      query: params.query!,
    },
    skip: true,
  });
  const debouncedRefetch = useDebouncedCallback((text: string) => {
    refetch({
      filter: params.filter ?? "",
      query: text,
    });
  }, 500);

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={pharmacies}
        renderItem={({ item }) => (
          <FeaturedCard item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32 flex flex-col gap-6 w-full bg-white px-2"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={loading ? <Loader /> : <NoResults />}
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-8">
              <Text className="text-lg  mr-2 text-center font-rubik-bold text-black-300">
                Rechercher une pharmacie
              </Text>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>

            <Search
              value={searchQuery}
              onChange={(text) => {
                setSearchQuery(text);
                debouncedRefetch(text);
              }}
            />
            {/* <Filters /> */}
            <View className="mt-5">
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                {(pharmacies?.length ?? 0) <= 1
                  ? `${pharmacies?.length ?? 0} pharmacie trouvée`
                  : `${pharmacies?.length ?? 0} pharmacies trouvées`}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Explore;
