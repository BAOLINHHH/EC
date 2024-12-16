import Wishlist from "../models/wishlistModel.js";

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlistByUser = async (req, res) => {
  // Kiểm tra xem req.user có tồn tại không
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const userId = req.user._id;

  try {
    // Lấy wishlist của người dùng
    const wishlist = await Wishlist.findOne({ user: userId }).populate("wishlistItems.product");

    if (!wishlist) {
      return res.status(200).json({ wishlistItems: [] }); // Trả về danh sách trống nếu không tìm thấy wishlist
    }

    // Loại bỏ các sản phẩm không hợp lệ (null hoặc undefined)
    const validWishlistItems = wishlist.wishlistItems.filter(item => item.product !== null && item.product !== undefined);

    // Trả về danh sách wishlist sau khi đã loại bỏ các sản phẩm không hợp lệ
    res.status(200).json({ wishlistItems: validWishlistItems });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, wishlistItems: [] });
    }

    const alreadyInWishlist = wishlist.wishlistItems.find(
      (item) => item.product.toString() === productId
    );

    if (alreadyInWishlist) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.wishlistItems.push({ product: productId });
    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.wishlistItems = wishlist.wishlistItems.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};


// @desc    Check if a product is in the user's wishlist
// @route   GET /api/wishlist/product/:productId
// @access  Private
const checkProductInWishlist = async (req, res) => {
  const userId = req.user._id;  // Get the current user's ID from the request
  const { productId } = req.params;

  try {
    // Find the wishlist for the current user
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // If the user has no wishlist, the product is obviously not in the wishlist
      return res.status(200).json({ isInWishlist: false });
    }

    // Check if the product is in the user's wishlist
    const productExists = wishlist.wishlistItems.some(
      (item) => item.product.toString() === productId
    );

    res.status(200).json({ isInWishlist: productExists });
  } catch (error) {
    res.status(500).json({ message: "Error checking wishlist", error });
  }
};


export {
  getWishlistByUser,
  addToWishlist,
  removeFromWishlist,
  checkProductInWishlist,
};