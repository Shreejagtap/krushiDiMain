import { useSignUp } from "@clerk/clerk-expo";
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
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const SignupScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  useWarmUpBrowser();

  const { signUp, setActive } = useSignUp();
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Sign Up",
      headerTitleAlign: "center",
      headerShadowVisible: false,
    });
  }, []);

  const onSignUpPress = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    try {
      if (!signUp) throw new Error("SignUp not initialized");

      await signUp.create({
        firstName: name,
        emailAddress: email,
        password,
      });

      // Start verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const onVerifyPress = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter verification code");
      return;
    }

    try {
      if (!signUp) throw new Error("SignUp not initialized");

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (!setActive) throw new Error("SetActive not initialized");

      await setActive({ session: completeSignUp.createdSessionId });
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

  if (verifying) {
    return (
      <View className="flex-1 bg-background p-5">
        <Text className="text-xl text-center mb-6">
          Please enter the verification code sent to your email
        </Text>
        <TextInput
          className="border border-gray-300 bg-gray-50 rounded-lg p-5 mb-3 text-lg text-gray-800"
          placeholder="Verification Code"
          placeholderTextColor="#aaa"
          value={code}
          onChangeText={setCode}
          autoCapitalize="none"
          keyboardType="number-pad"
        />
        <TouchableOpacity
          className="bg-primary py-4 rounded-lg items-center mb-5"
          onPress={onVerifyPress}
        >
          <Text className="text-white text-lg font-bold">Verify Email</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-5">
      {/* Name Input */}
      <TextInput
        className="border border-gray-300 bg-gray-50 rounded-lg p-5 mb-3 text-lg text-gray-800 mt-6"
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      {/* Email Input */}
      <TextInput
        className="border border-gray-300 bg-gray-50 rounded-lg p-5 mb-3 text-lg text-gray-800"
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

      {/* Confirm Password Input */}
      <TextInput
        className="border border-gray-300 bg-gray-50 rounded-lg p-5 mb-3 text-lg text-gray-800"
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        className="bg-primary py-4 rounded-lg items-center mb-5"
        onPress={onSignUpPress}
      >
        <Text className="text-white text-lg font-bold">Sign Up</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View className="flex-row items-center my-5">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-3 text-secondaryForeground text-xl">
          Or Sign Up using
        </Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Social Signup Button */}
      <View className="flex-col items-center gap-5 mb-5">
        <TouchableOpacity
          className="bg-white border border-gray-300 w-full justify-center rounded-lg p-3 flex-row items-center gap-2"
          onPress={onGooglePress}
        >
          <Image
            source={require("@/assets/icons/google.png")}
            className="h-10 w-10 aspect-square"
          />
          <Text className="text-lg font-semibold">Sign Up with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Login Link */}
      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text className="text-center text-secondaryForeground">
          Already have an account?{" "}
          <Text className="text-green-600 font-bold">Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
