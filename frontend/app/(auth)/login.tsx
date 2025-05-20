import { useSignIn, useSSO, useAuth } from "@clerk/clerk-expo";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
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

const LoginScreen = () => {
  const { isSignedIn } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(app)/(tabs)/home");
    }
  }, [isSignedIn]);

  useWarmUpBrowser();

  const { signIn, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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
    setLoading(true);
    try {
      if (!signIn) throw new Error("SignIn not initialized");

      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      if (!completeSignIn.createdSessionId) {
        throw new Error("Failed to create session");
      }

      if (!setActive) throw new Error("SetActive not initialized");

      await setActive({ session: completeSignIn.createdSessionId });
      router.replace("/(app)/(tabs)/home");
    } catch (err: any) {
      if (!err.message.toLowerCase().includes("cancel")) {
        Alert.alert(
          "Sign In Error",
          err.message || "Could not sign in. Please try again."
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
        "Sign In Error",
        err.message || "Could not sign in with Google. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-5">
      {loading && (
        <View className="absolute inset-0 z-50 justify-center items-center bg-black/30">
          <ActivityIndicator size="large" color="#256203" />
        </View>
      )}
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

      {/* Password Input with Eye Button */}
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
          className="absolute right-4 top-1/2 -translate-y-1/2"
          onPress={() => setShowPassword((prev) => !prev)}
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <Ionicons name="eye-off" size={24} color="#333" />
          ) : (
            <Ionicons name="eye" size={24} color="#333" />
          )}
        </TouchableOpacity>
      </View>

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
