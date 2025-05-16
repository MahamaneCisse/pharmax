import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebouncedCallback } from "use-debounce";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import NoResults from "@/components/NoResults";
import { FeaturedCard } from "@/components/Cards";
import { useGlobalContext } from "@/lib/global-provider";
import { getNearbyPharmacies } from "@/lib/appwrite"; // ici

const Index = () => {
  const { user } = useGlobalContext();
  const numero = "+223 80 00 12 11";
  const appeler = () => Linking.openURL(`tel:${numero}`);

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPharmacies = async () => {
    setLoading(true);
    const data = await getNearbyPharmacies();
    setPharmacies(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const debouncedSearch = useDebouncedCallback((text: string) => {
    setSearchQuery(text);
  }, 500);

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const query = searchQuery.toLowerCase();
    return (
      pharmacy.name?.toLowerCase().includes(query) ||
      pharmacy.ville?.toLowerCase().includes(query) ||
      pharmacy.quartier?.toLowerCase().includes(query)
    );
  });

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={filteredPharmacies}
        renderItem={({ item }) => (
          <FeaturedCard item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32 flex flex-col gap-6 w-full bg-white px-2"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5 ">
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

            <Search
              value={searchQuery}
              onChange={(text) => {
                debouncedSearch(text);
              }}
            />

            {loading ? (
              <ActivityIndicator
                size="large"
                className="text-primary-300 mt-5"
              />
            ) : filteredPharmacies.length === 0 ? (
              <NoResults />
            ) : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Index;
