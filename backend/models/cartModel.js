import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
  author: { type: String, required: true },
  bookDetail: { type: String, required: true },
  bookImage: { type: String, required: true },
  bookName: { type: String, required: true },
  bookPrice: { type: Number, required: true },
  bookQuaranty: { type: Number, required: true },
  category: { type: String, required: true },
  language: { type: String, required: true },
  numReviews: { type: Number, required: true },
  pageNumber: { type: Number, required: true },
  publicCompany: { type: String, required: true },
  qty: { type: Number, required: true },
  rating: { type: Number, required: true },
});

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [cartItemSchema],
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    itemsShip: {
      type: Number, 
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "payment",
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
