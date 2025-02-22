import express from "express";
import { fetchAvailability } from "../controllers/availabilityController.js";

const router = express.Router();

// Define the availability route
router.post("/availability", fetchAvailability);

export default router;
