import mongoose from 'mongoose';

// Định nghĩa schema cho Coupon
const couponSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discount: { type: Number, required: true }, // % giảm giá
    maxDiscount: { type: Number, required: true }, // Giảm tối đa (đơn vị: VNĐ)
    minOrderValue: { type: Number, required: true }, // Đơn hàng tối thiểu (đơn vị: VNĐ)
    expirationDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

// Tạo model từ schema
const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;