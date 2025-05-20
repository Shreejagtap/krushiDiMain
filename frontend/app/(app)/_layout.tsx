import { Stack, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";

export default function Layout() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
