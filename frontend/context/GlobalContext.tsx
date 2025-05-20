import { createContext, ReactNode, useEffect, useState } from "react";

export type SensorData = {
  _id: string;
  temperature: number;
  humidity: number;
  lightDetected: boolean;
  soilMoisture: number;
  timestamp: Date;
  deviceId: string;
  createdAt: Date;
};

type ThresholdData = {
  _id: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightControl: boolean;
  createdAt: string;
  updatedAt: string;
};

type GlobalContextType = {
  sensorData?: SensorData[];
  thresholdData?: ThresholdData;
  fetchSensorData?: () => void;
  fetchThresholdData?: () => void;
};

export const GlobalContext = createContext<GlobalContextType>(
  {} as GlobalContextType
);

export default function GlobalProvider({ children }: { children: ReactNode }) {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [thresholdData, setThresholdData] = useState<ThresholdData>(
    {} as ThresholdData
  );

  // Use your local IP address for fetch URLs
  // const BASE_URL = 'http://localhost:3000';
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // <-- Replace with your actual local IP

  const fetchSensorData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/sensor`);
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const data = await res.json();
      // Always store as array
      setSensorData(data);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  const fetchThresholdData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/threshold`);
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const data = await res.json();
      setThresholdData(data);
    } catch (error) {
      console.error("Error fetching threshold data:", error);
    }
  };

  useEffect(() => {
    fetchSensorData();
    fetchThresholdData();
    const interval = setInterval(() => {
      console.log("fetching data...");
      fetchSensorData();
      fetchThresholdData();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        sensorData,
        thresholdData,
        fetchSensorData,
        fetchThresholdData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
