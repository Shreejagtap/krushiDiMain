import { useSignUp, useSSO } from "@clerk/clerk-expo";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { makeRedirectUri } from "expo-auth-session";
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

const SignupScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  useWarmUpBrowser();

  const { signUp, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Sign Up",
      headerTitleAlign: "center",
      headerShadowVisible: false,
    });
  }, []);

  const onSignUpPress = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      if (!signUp) throw new Error("SignUp not initialized");

      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      // Start verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter verification code");
      return;
    }

    setLoading(true);
    try {
      if (!signUp) throw new Error("SignUp not initialized");

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (!completeSignUp.createdSessionId) {
        Alert.alert("Error", "Failed to create session. Please try again.");
      }

      if (!setActive) throw new Error("SetActive not initialized");

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace("/(app)/(tabs)/home");
    } catch (err: any) {
      if (!err.message.toLowerCase().includes("cancel")) {
        Alert.alert(
          "Verification Error",
          err.message || "Failed to verify email. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = async () => {
    setLoading(true);
    try {
      if (!startSSOFlow) throw new Error("SSO not initialized");

      const redirectUrl = makeRedirectUri({
        scheme: "frontend",
        path: "/(auth)/oauth-callback",
      });

      console.log("OAuth Redirect URL:", redirectUrl);

      const result = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      // Handle cancellation - if result is null, user probably cancelled
      if (!result) {
        setLoading(false);
        return;
      }

      const { createdSessionId, setActive: resultSetActive } = result;

      // Only proceed if we have both a session and the ability to set it active
      if (createdSessionId && resultSetActive) {
        await resultSetActive({ session: createdSessionId });
        router.replace("/(auth)/oauth-callback");
      } else {
        // This is a real error case - OAuth completed but we didn't get what we need

        Alert.alert("Error", "Failed to create session. Please try again.");
      }
    } catch (err: any) {
      // Don't show error for cancellation
      if (err.message.toLowerCase().includes("cancel")) {
        return;
      }

      Alert.alert(
        "Sign Up Error",
        err.message || "Could not sign up with Google. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <View className="flex-1 bg-background p-5">
        {loading && (
          <View className="absolute inset-0 z-50 justify-center items-center bg-black/30">
            <ActivityIndicator size="large" color="#256203" />
          </View>
        )}
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
      {loading && (
        <View className="absolute inset-0 z-50 justify-center items-center bg-black/30">
          <ActivityIndicator size="large" color="#256203" />
        </View>
      )}
      {/* First Name Input */}
      <TextInput
        className="border border-gray-300 bg-gray-50 rounded-lg p-5 mb-3 text-lg text-gray-800 mt-6"
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />

      {/* Last Name Input */}
      <TextInput
        className="border border-gray-300 bg-gray-50 rounded-lg p-5 mb-3 text-lg text-gray-800"
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={lastName}
        onChangeText={setLastName}
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
      <View className="relative">
        <TextInput
          className="border border-gray-300 bg-gray-50 rounded-lg p-5 mb-3 text-lg text-gray-800 pr-12"
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={{ position: "absolute", right: 16, top: 22 }}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View className="relative">
        <TextInput
          className="border border-gray-300 bg-gray-50 rounded-lg p-5 mb-3 text-lg text-gray-800 pr-12"
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={{ position: "absolute", right: 16, top: 22 }}
          onPress={() => setShowConfirmPassword((prev) => !prev)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

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
