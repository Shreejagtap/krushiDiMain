import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  useWarmUpBrowser();

  const { signIn, setActive } = useSignIn();
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Login",
      headerTitleAlign: "center",
      headerShadowVisible: false,
    });
  }, []);

  const onSignInPress = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      if (!signIn) throw new Error("SignIn not initialized");

      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      if (!setActive) throw new Error("SetActive not initialized");

      await setActive({ session: completeSignIn.createdSessionId });
      router.push("/(app)/(tabs)/home");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const onGooglePress = async () => {
    try {
      if (!startGoogleOAuthFlow) throw new Error("OAuth not initialized");

      const { createdSessionId, setActive } = await startGoogleOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.push("/(app)/(tabs)/home");
      } else {
        throw new Error("OAuth flow failed");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View className="flex-1 bg-background p-5">
      {/* Email Input */}
      <TextInput
        className="border border-gray-300 bg-gray-50 rounded-lg p-5 mb-3 text-lg text-gray-800 mt-6"
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        className="border border-gray-300 bg-gray-50 rounded-lg p-5 mb-3 text-lg text-gray-800"
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Forgot Password */}
      <TouchableOpacity
        onPress={() => {
          /* Implement forgot password flow */
        }}
      >
        <Text className="text-right font-semibold text-blue-500 mb-5">
          Forgot your password?
        </Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity
        className="bg-primary py-4 rounded-lg items-center mb-5"
        onPress={onSignInPress}
      >
        <Text className="text-white text-lg font-bold">Sign In</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View className="flex-row items-center my-5">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-3 text-secondaryForeground text-xl">
          Or Sign In using
        </Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Social Login Button */}
      <View className="flex-col items-center gap-5 mb-5">
        <TouchableOpacity
          className="bg-white border border-gray-300 w-full justify-center rounded-lg p-3 flex-row items-center gap-2"
          onPress={onGooglePress}
        >
          <Image
            source={require("@/assets/icons/google.png")}
            className="h-10 w-10 aspect-square"
          />
          <Text className="text-lg font-semibold">Sign In with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text className="text-center text-secondaryForeground">
          Need An Account?{" "}
          <Text className="text-green-600 font-bold">Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
