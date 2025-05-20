import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FlatList, Image, SafeAreaView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useDebouncedCallback } from "use-debounce";

import icons from "@/constants/icons";
import Search from "@/components/Search";
import Loader from "@/components/Loader";
import { PharmacieCard } from "@/components/Cards";
import NoResults from "@/components/NoResults";
import { getPharmacies } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import Filters from "@/components/Filters";
const Explore = () => {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState({
    ville: "",
    quartier: "",
  });

  const {
    data: pharmacies,
    refetch,
    loading,
  } = useAppwrite({
    fn: getPharmacies,
    params: {
      filter: params.filter ?? "",
      query: params.query ?? "",
    },
    skip: true,
  });

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      setFilterState((prev) => ({ ...prev, [key]: value }));
      refetch({
        filter: `${key}:${value}`, // tu peux adapter selon ton backend
        query: searchQuery,
      });
    },
    [searchQuery]
  );
  // Requête initiale lors du montage ou changement d’URL params
  useEffect(() => {
    setSearchQuery(params.query ?? "");
    refetch({
      filter: params.filter ?? "",
      query: params.query ?? "",
    });
  }, [params.filter, params.query]);

  // Requête en direct à chaque frappe (après délai)
  const debouncedRefetch = useDebouncedCallback((text: string) => {
    refetch({
      filter: params.filter ?? "",
      query: text,
    });
  }, 500);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      debouncedRefetch(text);
    },
    [debouncedRefetch]
  );

  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  const renderHeader = useMemo(
    () => (
      <View className="px-5">
        <View className="flex flex-row items-center justify-between mt-8">
          <Text className="text-lg font-rubik-bold text-black-300">
            Rechercher une pharmacie
          </Text>
          <Image source={icons.bell} className="w-6 h-6" />
        </View>

        <Search value={searchQuery} onChange={handleSearchChange} />

        <View className="mt-5">
          <Text className="text-xl font-rubik-bold text-black-300 mt-5">
            {(pharmacies?.length ?? 0) <= 1
              ? `${pharmacies?.length ?? 0} pharmacie trouvée`
              : `${pharmacies?.length ?? 0} pharmacies trouvées`}
          </Text>
        </View>
      </View>
    ),
    [searchQuery, pharmacies?.length, handleSearchChange]
  );

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={pharmacies}
        renderItem={({ item }) => (
          <PharmacieCard
            item={item}
            onPress={() => handleCardPress(item.$id)}
          />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32 flex flex-col gap-6 w-full bg-white px-2"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={loading ? <Loader /> : <NoResults />}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
};

export default Explore;
