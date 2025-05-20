import { Router } from "express";
import { getSensorData } from "../controllers/sensor.controller.js";

const router = Router();

router.get("/", getSensorData);

export default router;
