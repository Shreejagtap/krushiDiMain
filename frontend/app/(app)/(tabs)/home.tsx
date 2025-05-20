import { GlobalContext } from "@/context/GlobalContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import { useContext } from "react";
import { Text, View } from "react-native";

const HomeScreen = () => {
  const { sensorData } = useContext(GlobalContext);

  const latestSensorData = sensorData?.[0];

  return (
    <ProtectedRoute>
      <View className="flex-1 justify-center bg-gradient-to-b from-green-200 via-green-100 to-green-300 py-6 px-2">
        <View className="bg-white/90 border-2 border-green-500 rounded-2xl py-6 items-center shadow-xl mx-2">
          <Text className="text-3xl font-extrabold text-green-700 tracking-wide drop-shadow mb-1">
            Temperature
          </Text>
          <Text className="text-4xl font-black text-gray-900 text-center mt-1">
            {latestSensorData?.temperature}°C
          </Text>
        </View>
        <View className="h-6" />
        <View className="bg-white/90 border-2 border-green-500 rounded-2xl py-6 items-center shadow-xl mx-2">
          <Text className="text-3xl font-extrabold text-green-700 tracking-wide drop-shadow mb-1">
            Humidity
          </Text>
          <Text className="text-4xl font-black text-gray-900 text-center mt-1">
            {latestSensorData?.humidity}%
          </Text>
        </View>
        <View className="h-6" />
        <View className="bg-white/90 border-2 border-green-500 rounded-2xl py-6 items-center shadow-xl mx-2">
          <Text className="text-3xl font-extrabold text-green-700 tracking-wide drop-shadow mb-1">
            Soil Moisture
          </Text>
          <Text className="text-4xl font-black text-gray-900 text-center mt-1">
            {latestSensorData?.soilMoisture}%
          </Text>
        </View>
        <View className="h-6" />
        <View className="bg-white/90 border-2 border-green-500 rounded-2xl py-6 items-center shadow-xl mx-2">
          <Text className="text-3xl font-extrabold text-green-700 tracking-wide drop-shadow mb-1">
            Light
          </Text>
          <Text className="text-4xl font-black text-gray-900 text-center mt-1">
            {latestSensorData?.lightDetected ? "Yes" : "No"}
          </Text>
        </View>
      </View>
    </ProtectedRoute>
  );
};

export default HomeScreen;
