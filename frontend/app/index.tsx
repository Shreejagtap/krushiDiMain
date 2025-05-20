import { useAuth } from "@clerk/clerk-expo";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const SplashScreen = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      // Simulate an async operation (e.g., checking a token)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);

      if (isSignedIn) {
        router.replace("/(app)/(tabs)/home");
      } else {
        router.replace("/(onboarding)/onboarding");
      }
    };

    checkAuth();
  }, [isSignedIn]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
};

export default SplashScreen;
