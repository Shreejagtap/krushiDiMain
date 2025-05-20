import React, { useLayoutEffect } from "react";
import { Stack, useNavigation } from "expo-router";

export default function Layout() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <Stack>
      <Stack.Screen name="oauth-callback" options={{ headerShown: false }} />
    </Stack>
  );
}
