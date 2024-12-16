import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Định nghĩa schema cho shippingAddress
const shippingAddressSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  addressDetails: {
    type: String,
    required: true,
  },
});

// Định nghĩa userSchema và thêm trường shippingAddress dưới dạng mảng
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: Number,
      required: true,
      default: 0,
    },
    code: { type: Number, required: false },
    expiresAt: { type: Date, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
    // Thêm trường shippingAddress là mảng của các địa chỉ giao hàng
    shippingAddress: [shippingAddressSchema],
  },
  {
    timestamps: true,
  }
);

// Hàm kiểm tra mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware mã hóa mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;