import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import thresholdRoutes from "./routes/threshold.routes.js";
import sensorRoutes from "./routes/sensor.routes.js";

import cookieParser from "cookie-parser";

const app = express();

await dotenv.config();

const PORT = process.env.PORT || 5000;

// Allow CORS for React Native (all origins, all methods, allow credentials if needed)
app.use(
  cors({
    origin: process.env.APP_URL, // Or specify your frontend IP: 'http://192.168.1.10:19006'
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Connect to MongoDB
await connectDB();
// Middleware to parse cookies
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the server</h1>");
});

// Import routes

app.use("/api/v1/threshold", thresholdRoutes);
app.use("/api/v1/sensor", sensorRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Listen server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
