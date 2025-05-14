import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, ScrollView, TouchableOpacity } from "react-native";
import { useAppwrite } from "@/lib/useAppwrite";
import { getPharmacies } from "@/lib/appwrite";

const Filters = () => {
  const params = useLocalSearchParams<{ filter?: string }>();
  const [selectedVille, setSelectedVille] = useState(params.filter || "Toutes");
  const [uniqueVilles, setUniqueVilles] = useState<string[]>([]);

  const { data: pharmacies, loading } = useAppwrite({
    fn: getPharmacies,
    params: {
      filter: "", // récupérer toutes les pharmacies
      query: "",
    },
    skip: false,
  });

  // Extraire les villes uniques
  useEffect(() => {
    if (pharmacies && pharmacies.length > 0) {
      const villes = Array.from(new Set(pharmacies.map((p: any) => p.ville)));
      setUniqueVilles(["Toutes", ...villes]);
    }
  }, [pharmacies]);

  const handleVillePress = (ville: string) => {
    setSelectedVille(ville);
    router.setParams({ filter: ville === "Toutes" ? "" : ville });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2 px-4"
    >
      {uniqueVilles.map((ville, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleVillePress(ville)}
          className={`mr-3 px-4 py-2 rounded-full ${
            selectedVille === ville
              ? "bg-primary-300"
              : "bg-primary-100 border border-primary-200"
          }`}
        >
          <Text
            className={`text-sm ${
              selectedVille === ville
                ? "text-white font-rubik"
                : "text-black-300 font-rubik"
            }`}
          >
            {ville}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Filters;
