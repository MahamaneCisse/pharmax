import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect } from "expo-router";

const Auth = () => {
  const { refetch, loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLogin = async () => {
    const result = await login();
    if (result) {
      refetch();
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };

  return (
    <SafeAreaView className="bg-white h-full  flex-1 justify-center items-center ">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.logoPharm}
          className="w-full h-3/6"
          resizeMode="contain"
        />
        <View className="px-6">
          <Text className="text-base text-center uppercase font-rubik text-primary-200">
            Bienveue sur Pharmax
          </Text>
          <Text className="text-2xl font-rubik-bold text-black-300 text-center mt-2">
            Trouver la pharmacie la plus proche {"\n"}
            <Text className="text-primary-100">de chez vous</Text>
          </Text>
          <Text className="text-lg font-rubik text-black-200 text-center mt-3">
            connectez-vous
          </Text>
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white shadow-md shadow-zinc-300 w-full py-4 mt-3 border border-black"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-black ml-2">
                Continuez avec google
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-black shadow-md shadow-zinc-300 w-full py-4 mt-3"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.apple}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-white ml-2 shadow-black-300">
                Continuez avec icloud
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
