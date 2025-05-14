import { useGlobalContext } from "@/lib/global-provider";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Redirect, Slot } from "expo-router";
import Loader from "@/components/Loader";

export default function AppLayout() {
  const { loading, isLogged } = useGlobalContext();
  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <Loader />
      </SafeAreaView>
    );
  }
  if (!isLogged) return <Redirect href="/sign_in" />;
  return <Slot />;
}
