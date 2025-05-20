import mongoose from "mongoose";

const thresholdSchema = new mongoose.Schema(
  {
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    soilMoisture: {
      type: Number,
      required: true,
    },
    lightControl: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const Threshold = mongoose.model("Threshold", thresholdSchema, "thresholds");
export default Threshold;
