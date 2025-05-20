import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { getFilterOptions } from "../lib/appwrite"; // adapte le chemin

type FiltersProps = {
  selected: { ville?: string; quartier?: string };
  onChange: (key: "ville" | "quartier", value: string) => void;
};

const Filters = ({ selected, onChange }: FiltersProps) => {
  const [filterOptions, setFilterOptions] = useState<{
    ville: string[];
    quartier: string[];
  }>({ ville: [], quartier: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      const data = await getFilterOptions();
      setFilterOptions({
        ville: ["Toutes", ...data.ville],
        quartier: ["Toutes", ...data.quartier],
      });
      setLoading(false);
    };

    loadOptions();
  }, []);

  const renderGroup = (key: "ville" | "quartier", options: string[]) => (
    <View className="mb-3">
      <Text className="font-rubik-medium text-black mb-2 capitalize">
        {key}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt) => {
          const value = opt === "Toutes" ? "" : opt;
          const isActive =
            selected[key] === value || (!selected[key] && opt === "Toutes");

          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(key, value)}
              className={`px-3 py-1 rounded-full border ${
                isActive
                  ? "bg-primary-100 border-primary-100"
                  : "border-gray-300"
              }`}
            >
              <Text className={isActive ? "text-white" : "text-black"}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="mt-4 px-2 items-center">
        <ActivityIndicator size="small" color="#00B0FF" />
        <Text className="text-gray-400 mt-2">Chargement des filtres…</Text>
      </View>
    );
  }

  return (
    <View className="mt-4 px-2">
      {renderGroup("ville", filterOptions.ville)}
      {renderGroup("quartier", filterOptions.quartier)}
    </View>
  );
};

export default Filters;
