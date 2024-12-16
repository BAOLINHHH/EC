// backend/models/wishlistModel.js

import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wishlistItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;