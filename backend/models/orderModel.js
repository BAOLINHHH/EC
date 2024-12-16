import mongoose, { mongo } from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        bookName: { type: String, required: true },
        qty: { type: Number, required: true },
        bookImage: { type: String, required: true },
        bookPrice: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      city: { type: String, required: false, default: null },
      district: { type: String, required: false, default: null },
      wards: { type: String, required: false, default: null },
      address: { type: String, required: false, default: null },
      phone: { type: String, required: false, default: null },
      recipientName: { type: String, required: false, default: null },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String }, //paypal,...
      update_time: { type: String },
    },
    orderStatus: {
      type: String,
      required: true,
      default: "Đã tạo đơn đặt hàng", // Trạng thái mặc định
      enum: [
        "Đã tạo đơn đặt hàng",
        "Đang chờ đơn vị vận chuyển",
        "Đang vận chuyển",
        "Đơn hàng đã được giao",
        "Đã hủy"
      ],
    },
    cancelReason: {
      type: String, // Lưu lý do hủy đơn hàng
      required: false, // Không bắt buộc
    },
    canceledAt: {
      type: Date, // Thời gian hủy đơn hàng
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    discountAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    trackingCode: {
      type: String,
      required: false,
      unique: true,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "UsedCoupon",
    },
    isEbook: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;