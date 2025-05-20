import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebouncedCallback } from "use-debounce";

import icons from "@/constants/icons";
import Search from "@/components/Search";
import NoResults from "@/components/NoResults";
import Loader from "@/components/Loader";
import { PharmacieCard } from "@/components/Cards";
import { useGlobalContext } from "@/lib/global-provider";
import { getNearbyPharmacies } from "@/lib/appwrite";

const Index = () => {
  const { user } = useGlobalContext();
  const numero = "+22380001211";
  const appeler = () => Linking.openURL(`tel:${numero}`);

  const [searchQuery, setSearchQuery] = useState("");
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const data = await getNearbyPharmacies();
      setPharmacies(data || []);
    } catch (err) {
      console.error("Erreur chargement pharmacies :", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPharmacies();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const debouncedSearch = useDebouncedCallback((text: string) => {
    setSearchQuery(text);
  }, 500);

  const handleSearchChange = useCallback(
    (text: string) => {
      debouncedSearch(text);
    },
    [debouncedSearch]
  );

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const query = searchQuery.toLowerCase();
    return (
      pharmacy.name?.toLowerCase().includes(query) ||
      pharmacy.ville?.toLowerCase().includes(query) ||
      pharmacy.quartier?.toLowerCase().includes(query)
    );
  });

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  const renderHeader = useMemo(
    () => (
      <View className="px-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row">
            <Image
              source={{ uri: user?.avatar }}
              className="size-12 rounded-full"
            />
            <View className="ml-2 justify-center">
              <Text className="text-base font-rubik-medium text-black-300">
                {user?.name}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={appeler}
            accessibilityLabel="Appel d'urgence"
          >
            <Image
              source={icons.appel_durgence}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>

          <Image source={icons.bell} className="size-6" />
        </View>

        <View className="w-full mt-3 flex justify-center items-center">
          <Text className="text-4xl font-rubik-extrabold text-black">
            PHARMA<Text className="text-primary-100">X</Text>
          </Text>
        </View>

        <Search value={searchQuery} onChange={handleSearchChange} />

        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-rubik-bold text-black-300 mt-5">
            Pharmacies à proximité
          </Text>
        </View>
      </View>
    ),
    [user, searchQuery, handleSearchChange]
  );

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={filteredPharmacies}
        renderItem={({ item }) => (
          <PharmacieCard
            item={item}
            onPress={() => handleCardPress(item.$id)}
          />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32 flex-1 flex flex-col gap-6 w-full bg-white px-2"
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          loading ? (
            <View className="flex-1 justify-center items-center">
              <Loader />
            </View>
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
};

export default Index;
