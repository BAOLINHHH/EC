import express from "express";
import {
  createCoupon,
  getCoupons,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

// Tạo mới Coupon
router.post("/create", createCoupon);

// Lấy tất cả Coupons
router.get("/", getCoupons);

// Lấy Coupon theo mã code
router.get("/:code", getCouponByCode);

// Cập nhật Coupon theo mã code
router.put("/:id", updateCoupon);

// Xóa Coupon theo mã code
router.delete("/:id", deleteCoupon);

// Áp dụng Coupon
router.post("/apply", applyCoupon);

export default router;