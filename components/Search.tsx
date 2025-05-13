import React, { useState, useEffect } from "react";
import { View, Image, TextInput } from "react-native";
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
  }, 1000);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedChange(text);
  };

  useEffect(() => {
    setSearch(value);
  }, [value]);

  return (
    <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Rechercher une pharmacie..."
          className="text-sm font-rubik text-black-300 ml-2 flex-1"
        />
      </View>
    </View>
  );
};

export default Search;
