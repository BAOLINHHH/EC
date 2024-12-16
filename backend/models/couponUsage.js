import mongoose from "mongoose";

const usedCouponSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với bảng User
      required: true,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon", // Liên kết với bảng Coupon
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Tạo model từ schema
const UsedCoupon = mongoose.model('UsedCoupon', usedCouponSchema);

export default UsedCoupon;