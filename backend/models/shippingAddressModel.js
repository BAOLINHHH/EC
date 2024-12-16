import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shippingAddress: [
      {
        recipientName: {
          type: String,
        },
        phoneNumber: {
          type: String,
        },
        ProvinceID: {
          type: Number,
        },
        ProvinceName: {
          type: String,
        },
        DistrictID: {
          type: Number,
        },
        DistrictName: {
          type: String,
        },
        WardCode: {
          type: String,
        },
        WardName: {
          type: String,
        },
        addressDetails: {
          type: String,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ShippingAddress = mongoose.model('ShippingAddress', shippingAddressSchema);

export default ShippingAddress;
