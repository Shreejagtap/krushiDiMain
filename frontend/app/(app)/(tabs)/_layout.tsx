import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

export default function Layout() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerRight: () => (
            <View className="pr-4">
              <TouchableNativeFeedback
                onPress={async () => {
                  // Import and use Clerk's signOut function
                  await signOut();
                  router.replace("/(auth)/login");
                }}
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons name="log-out-outline" size={24} color="red" />
                  <Text className="text-red-500">Logout</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="values"
        options={{
          title: "Overview",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
          headerStyle: {},
        }}
      />
      <Tabs.Screen
        name="status"
        options={{
          title: "Status",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="checkmark-circle" size={size} color={color} />
          ),
          headerStyle: {},
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          headerStyle: {},
        }}
      />
    </Tabs>
  );
}
