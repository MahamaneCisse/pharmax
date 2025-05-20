import React, { useState, useEffect } from "react";
import { View, Image, TextInput, Platform } from "react-native";
import { useDebouncedCallback } from "use-debounce";
import icons from "@/constants/icons";

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const Search = ({ value, onChange }: SearchProps) => {
  const [search, setSearch] = useState(value);

  const debouncedChange = useDebouncedCallback((text: string) => {
    onChange(text);
  }, 500);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedChange(text);
  };

  useEffect(() => {
    setSearch(value);
  }, [value]);

  return (
    <View className="flex-row items-center w-full mt-5 px-4 py-2 rounded-lg bg-accent-100 border border-primary-100">
      <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />

      <TextInput
        value={search}
        onChangeText={handleSearch}
        placeholder="Rechercher une pharmacie..."
        placeholderTextColor="#888"
        className="ml-2 flex-1 text-sm text-black-300 font-rubik"
        accessible
        accessibilityLabel="Champ de recherche"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode={Platform.OS === "ios" ? "while-editing" : "never"}
      />
    </View>
  );
};

export default Search;
