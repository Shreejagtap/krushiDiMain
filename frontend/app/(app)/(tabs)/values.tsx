import { Text, ScrollView } from "react-native";
import React, { use, useContext } from "react";
import { LineChart } from "react-native-gifted-charts";
import { GlobalContext } from "@/context/GlobalContext";

export default function Values() {
  const { sensorData } = useContext(GlobalContext);

  const tempData = sensorData?.map((item, i) => ({
    value: item.temperature,
    label: `${i + 1}`,
  }));
  const humidityData = sensorData?.map((item, i) => ({
    value: item.humidity,
    label: `${i + 1}`,
  }));
  const soilData = sensorData?.map((item, i) => ({
    value: item.soilMoisture,
    label: `${i + 1}`,
  }));

  const chartConfig = {
    thickness: 3,
    color: "#256203",
    hideDataPoints: false,
    areaChart: true,
    startFillColor: "#4ade80",
    endFillColor: "#fff",
    startOpacity: 0.3,
    endOpacity: 0,
    yAxisThickness: 0,
    xAxisThickness: 0,
    noOfSections: 5,
    maxValue: 100,
    yAxisTextStyle: { color: "#6B6767", fontSize: 12 },
    xAxisLabelTextStyle: { color: "#222", fontSize: 12 },
    xAxisLabelTexts: sensorData?.map((_, i) => `${i + 1}`),
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ alignItems: "center", paddingVertical: 32 }}
    >
      {/* Temperature Line Chart */}
      <Text className="text-xl font-semibold mb-2">
        Temperature (latest 20)
      </Text>
      <LineChart
        data={tempData}
        {...chartConfig}
        height={180}
        width={340}
        showVerticalLines={false}
        showXAxisIndices={false}
        showYAxisIndices={false}
      />
      {/* Humidity Line Chart */}
      <Text className="text-xl font-semibold mb-2 mt-8">
        Humidity (latest 20)
      </Text>
      <LineChart
        data={humidityData}
        {...chartConfig}
        height={180}
        width={340}
        showVerticalLines={false}
        showXAxisIndices={false}
        showYAxisIndices={false}
      />
      {/* Soil Moisture Line Chart */}
      <Text className="text-xl font-semibold mb-2 mt-8">
        Soil Moisture (latest 20)
      </Text>
      <LineChart
        data={soilData}
        {...chartConfig}
        height={180}
        width={340}
        showVerticalLines={false}
        showXAxisIndices={false}
        showYAxisIndices={false}
      />
    </ScrollView>
  );
}
