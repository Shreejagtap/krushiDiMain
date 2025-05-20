import Sensor from "../models/Sensor.model.js";

const getSensorData = async (req, res) => {
  try {
    // Fetch the latest 20 sensor data entries from the database
    const sensorData = await Sensor.find({}).sort({ createdAt: -1 }).limit(20);

    if (!sensorData || sensorData.length === 0) {
      return res.status(404).json({ message: "Sensor data not found" });
    }

    res.status(200).json(sensorData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getSensorData };
