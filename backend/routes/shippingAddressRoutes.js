import express from "express";
const router = express.Router();
import {
  getShippingAddressesByUser,
  addShippingAddress,
  deleteShippingAddress,
  checkShippingAddress,
  updateShippingAddress,
  getDefaultShippingAddress,
} from "../controllers/shippingAddressController.js";
import { protect } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(protect, getShippingAddressesByUser) // Get all shipping addresses
  .post(protect, addShippingAddress) // Add a new shipping address

// Route để lấy địa chỉ giao hàng mặc định phải đặt trước
router.get("/default", protect, getDefaultShippingAddress); // Get the default shipping address

router.route("/:shippingaddressID").delete(protect, deleteShippingAddress); // Remove from list
router.route("/:shippingaddressID").put(protect, updateShippingAddress); // Update address

router.get("/:shippingaddressID", protect, checkShippingAddress); // Check if a specific shipping address exists

export default router;
