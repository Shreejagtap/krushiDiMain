import { GlobalContext, SensorData } from "@/context/GlobalContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import React, { useContext, useState } from "react";
import { Text, View } from "react-native";

const Status = () => {
  const [fan, setFan] = useState(false);
  const [motor, setMotor] = useState(false);
  const [bulb, setBulb] = useState(false);

  const { sensorData, thresholdData } = useContext(GlobalContext);
  const latestSensorData: SensorData = sensorData?.[0] || {
    _id: "",
    temperature: 0,
    humidity: 0,
    lightDetected: false,
    soilMoisture: 0,
    timestamp: new Date(),
    deviceId: "",
    createdAt: new Date(),
  };

  return (
    <ProtectedRoute>
      <View className="flex-1 bg-white px-6 pt-10">
        {/* Temperature */}
        <View className="bg-gray-300 items-center py-2.5 my-4 rounded">
          <Text className="text-[22px] text-[#222] font-normal">
            Temperature
          </Text>
        </View>

        {/* FAN */}
        <Text className="text-[22px] text-center mb-1 text-[#222]">FAN</Text>
        <View className="flex-row items-center justify-center mb-4">
          <Text
            className={`text-[18px] font-bold ${
              latestSensorData?.temperature > (thresholdData?.temperature ?? 0)
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {latestSensorData?.temperature > (thresholdData?.temperature ?? 0)
              ? "On"
              : "Off"}
            {`  (Current: ${latestSensorData?.temperature}°C, Threshold: ${
              thresholdData?.temperature ?? 0
            }°C)`}
          </Text>
        </View>

        {/* Soil Moisture */}
        <View className="bg-gray-300 items-center py-2.5 my-4 rounded">
          <Text className="text-[22px] text-[#222] font-normal">
            Soil Moisture
          </Text>
        </View>

        {/* Motor */}
        <Text className="text-[22px] text-center mb-1 text-[#222]">Motor</Text>
        <View className="flex-row items-center justify-center mb-4">
          <Text
            className={`text-[18px] font-bold ${
              latestSensorData?.soilMoisture <
              (thresholdData?.soilMoisture ?? 0)
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {latestSensorData?.soilMoisture < (thresholdData?.soilMoisture ?? 0)
              ? "On"
              : "Off"}
            {`  (Current: ${latestSensorData?.soilMoisture}%, Threshold: ${
              thresholdData?.soilMoisture ?? 0
            }%)`}
          </Text>
        </View>

        {/* Light */}
        <View className="bg-gray-300 items-center py-2.5 my-4 rounded">
          <Text className="text-[22px] text-[#222] font-normal">Light</Text>
        </View>
        {/* Light Status */}
        <View className="flex-row items-center justify-center mb-4">
          <Text
            className={`text-[18px] font-bold ${
              thresholdData?.lightControl && latestSensorData?.lightDetected
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {thresholdData?.lightControl && latestSensorData?.lightDetected
              ? "On"
              : "Off"}
            {`  (Control: ${
              thresholdData?.lightControl ? "Enabled" : "Disabled"
            }, Detected: ${latestSensorData?.lightDetected ? "Yes" : "No"})`}
          </Text>
        </View>
      </View>
    </ProtectedRoute>
  );
};

export default Status;
