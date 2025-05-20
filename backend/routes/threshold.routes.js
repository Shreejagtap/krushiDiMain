import { Router } from "express";
import {
  getThreshold,
  updateThreshold,
} from "../controllers/threshold.controller.js";

const router = Router();

router.get("/", getThreshold);
router.put("/", updateThreshold);

export default router;


// http requests
// GET, POST, PUT, DELETE
// GET: Retrieve data from the server
// POST: Create new data on the server
// PUT: Update existing data on the server
// DELETE: Remove data from the server