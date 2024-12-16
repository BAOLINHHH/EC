import express from "express";
const router = express.Router();
import { handleWebhook } from "../controllers/webhookController.js";
// import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(handleWebhook);

export default router;