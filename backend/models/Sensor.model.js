import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    lightDetected: {
      type: Boolean,
      required: true,
    },
    soilMoisture: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Sensor = mongoose.model("Sensor", sensorSchema, "sensors");
export default Sensor;
