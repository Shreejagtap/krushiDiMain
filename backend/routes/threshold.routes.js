import { Router } from "express";
import {
  getThreshold,
  updateThreshold,
} from "../controllers/threshold.controller.js";

const router = Router();

router.get("/", getThreshold);
router.put("/", updateThreshold);

export default router;
