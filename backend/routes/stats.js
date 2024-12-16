import express from "express";
const router = express.Router();
import { getBookPurchaseStats, getCountDashboard } from "../controllers/stats.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/purchases").get(protect, admin, getBookPurchaseStats);
router.route("/countDashboard").get(protect, admin, getCountDashboard);


export default router;