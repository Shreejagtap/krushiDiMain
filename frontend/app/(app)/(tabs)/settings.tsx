import { View, Text, TouchableOpacity, Switch } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import { GlobalContext } from "@/context/GlobalContext";

export default function Settings() {
  const { thresholdData, fetchThresholdData } = useContext(GlobalContext);

  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
    lightControl: false,
  });

  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    if (thresholdData) {
      setData({
        temperature: thresholdData.temperature,
        humidity: thresholdData.humidity,
        soilMoisture: thresholdData.soilMoisture,
        lightControl: thresholdData.lightControl,
      });
    }
  }, [thresholdData]);

  useEffect(() => {
    const isChanged =
      data.temperature !== (thresholdData?.temperature || 0) ||
      data.humidity !== (thresholdData?.humidity || 0) ||
      data.soilMoisture !== (thresholdData?.soilMoisture || 0) ||
      data.lightControl !== (thresholdData?.lightControl || false);
    setShowSave(isChanged);
  }, [data, thresholdData]);

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/v1/threshold`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error(`Status: ${res.status}`);
      await res.json();
      if (fetchThresholdData) {
        await fetchThresholdData();
      }
      setShowSave(false);
    } catch (error) {
      console.error("Error saving threshold data:", error);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-24">
      {/* Temperature */}
      <Text className="text-2xl mb-2">Temperature: {data.temperature}</Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={data.temperature}
        onValueChange={(value) =>
          setData((prev) => ({ ...prev, temperature: value }))
        }
        minimumTrackTintColor="#256203"
        maximumTrackTintColor="#fff"
        thumbTintColor="#256203"
      />

      {/* Humidity */}
      <Text className="text-2xl mt-8 mb-2">Humidity: {data.humidity}%</Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={data.humidity}
        onValueChange={(value) =>
          setData((prev) => ({ ...prev, humidity: value }))
        }
        minimumTrackTintColor="#256203"
        maximumTrackTintColor="#fff"
        thumbTintColor="#256203"
      />

      {/* Soil Moisture */}
      <Text className="text-2xl mt-8 mb-2">
        Soil Moisture: {data.soilMoisture}%
      </Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={data.soilMoisture}
        onValueChange={(value) =>
          setData((prev) => ({ ...prev, soilMoisture: value }))
        }
        minimumTrackTintColor="#256203"
        maximumTrackTintColor="#fff"
        thumbTintColor="#256203"
      />

      {/* Light Control */}
      <Text className="text-2xl mt-8 mb-2">Light Control</Text>
      <View className="flex-row items-center ">
        <Text className="text-xl">Off</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={data.lightControl ? "#256203" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() =>
            setData((prev) => ({ ...prev, lightControl: !prev.lightControl }))
          }
          value={data.lightControl}
        />
        <Text className="text-xl">On</Text>
      </View>

      {/* Save/Cancel Buttons */}
      {showSave && (
        <View className="flex-row w-full justify-between mt-20">
          <TouchableOpacity
            className="bg-gray-300 rounded-xl py-5 items-center w-[48%]"
            onPress={() => {
              setData({
                temperature: thresholdData?.temperature || 0,
                humidity: thresholdData?.humidity || 0,
                soilMoisture: thresholdData?.soilMoisture || 0,
                lightControl: thresholdData?.lightControl || false,
              });
            }}
          >
            <Text className="text-green-800 text-2xl font-bold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-800 rounded-xl py-5 items-center w-[48%]"
            onPress={handleSave}
          >
            <Text className="text-white text-2xl font-bold">Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
