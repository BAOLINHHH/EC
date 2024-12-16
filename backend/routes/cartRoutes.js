import express from "express";
const router = express.Router();
import { addToCart , getCartByUser} from "../controllers/cartController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addToCart)
router.route('/').get(protect, getCartByUser);

export default router;