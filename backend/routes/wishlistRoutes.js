import express from "express";
const router = express.Router();
import {
  getWishlistByUser,
  addToWishlist,
  removeFromWishlist,
  checkProductInWishlist,
} from "../controllers/wishlistController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(protect, getWishlistByUser) // Get wishlist
  .post(protect, addToWishlist); // Add to wishlist
router.route("/:productId").delete(protect, removeFromWishlist); // Remove from wishlist
router.get("/product/:productId", protect, checkProductInWishlist);

export default router;
