import Threshold from "../models/Threshold.model.js";

const getThreshold = async (req, res) => {
  try {
    const threshold = await Threshold.findOne({});
    console.log(threshold);
    if (!threshold) {
      return res.status(404).json({ message: "Threshold not found" });
    }
    res.status(200).json(threshold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the threshold
const updateThreshold = async (req, res) => {
  try {
    // Ensure req.body is always an object
    const { temperature, humidity, soilMoisture, lightControl } =
      req.body || {};

    if (
      temperature === undefined &&
      humidity === undefined &&
      soilMoisture === undefined &&
      lightControl === undefined
    ) {
      return res.status(400).json({ message: "No threshold values provided" });
    }

    const threshold = await Threshold.findOneAndUpdate(
      {},
      { temperature, humidity, soilMoisture, lightControl },
      { new: true }
    );

    if (!threshold) {
      return res.status(404).json({ message: "Threshold not found" });
    }

    res.status(200).json(threshold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getThreshold, updateThreshold };
