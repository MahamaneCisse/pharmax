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
import { login, loginWithApple } from "@/lib/appwrite";
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
      Alert.alert("Erreur", "Erreur lors de la connexion");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="flex-grow justify-between px-6 py-16">
        {/* Logo + Illustration */}
        <View className="items-center">
          <Image
            source={images.logoPharm}
            className="w-40 h-40 mb-4"
            resizeMode="contain"
          />
          <Text className="text-xl text-primary-300 text-center font-rubik-medium uppercase tracking-wider">
            Bienvenue sur {"\n"}
            <Text className="text-black font-rubik-bold">
              Pharma<Text className="text-primary-100">x</Text>
            </Text>
          </Text>
        </View>

        {/* Message central */}
        <View className="mt-8">
          <Text className="text-3xl font-rubik-bold text-black-300 text-center leading-snug">
            Trouvez la <Text className="text-primary-100">pharmacie</Text>{" "}
            {"\n"}
            <Text className="text-primary-100">la plus proche</Text> de chez
            vous
          </Text>
        </View>

        {/* Boutons de connexion */}
        <View className="mt-10 flex flex-col gap-4">
          <Text className="text-lg font-rubik text-black-200 text-center mt-4">
            Connectez-vous pour continuer
          </Text>
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white border border-gray-300  py-4 shadow-md flex-row items-center justify-center"
          >
            <Image
              source={icons.google}
              className="w-5 h-5 mr-3"
              resizeMode="contain"
            />
            <Text className="text-base font-rubik-medium text-black">
              Continuer avec Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              const result = await loginWithApple();
              if (result) {
                refetch();
              } else {
                Alert.alert("Erreur", "Échec de la connexion avec iCloud");
              }
            }}
            className="bg-black shadow-md shadow-zinc-300 w-full py-4 mt-3 "
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.apple}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-white ml-2 shadow-black-300">
                Continuez avec iCloud
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
