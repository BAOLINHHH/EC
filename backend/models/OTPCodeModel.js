import mongoose from 'mongoose';

const otpSchema = mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const OTP = mongoose.model('OTPCode', otpSchema);

export default OTP;
