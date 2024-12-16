import Coupon from "../models/couponModel.js";
import CouponUsage from "../models/couponUsage.js";

// @desc     Create a new coupon
// @route    POST api/coupons/create
// @access   Public
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount,
      maxDiscount,
      minOrderValue,
      expirationDate,
    } = req.body;
    const newCoupon = new Coupon({
      code,
      discount,
      maxDiscount,
      minOrderValue,
      expirationDate,
    });

    await newCoupon.save();
    res.status(201).json({
      message: "Coupon created successfully!",
      coupon: newCoupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating coupon", error });
  }
};

// @desc     Get all coupons
// @route    GET api/coupons
// @access   Public
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error });
  }
};

// @desc     Get a coupon by code
// @route    GET api/coupons/:code
// @access   Public
const getCouponByCode = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupon", error });
  }
};

// @desc     Update coupon by id
// @route    PUT api/coupons/:id
// @access   Public
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      discount,
      maxDiscount,
      minOrderValue,
      expirationDate,
      status,
    } = req.body;

    const updatedCoupon = await Coupon.findOneAndUpdate(
      { _id: id },
      { code, discount, maxDiscount, minOrderValue, expirationDate, status },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon updated successfully!",
      coupon: updatedCoupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating coupon", error });
  }
};

// @desc     Delete coupon by id
// @route    DELETE api/coupons/:id
// @access   Public
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await Coupon.findOneAndDelete({ _id: id });

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon deleted successfully!",
      coupon: deletedCoupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon", error });
  }
};

// @desc     Apply coupon
// @route    POST api/coupons/apply
// @access   Public
const applyCoupon = async (req, res) => {
  try {
    const { userId, code, orderValue } = req.body;

    // Tìm mã giảm giá trong bảng Coupon
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá." });
    }

    // Kiểm tra xem mã giảm giá đã được người dùng sử dụng chưa
    const usedCoupon = await CouponUsage.findOne({ userId, couponId: coupon._id });
    if (usedCoupon) {
      return res.status(400).json({
        message: "Bạn đã sử dụng mã giảm giá này rồi.",
      });
    }

    if (coupon.status === "inactive" || coupon.expirationDate < new Date()) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã hết hạn hoặc không còn hiệu lực." });
    }

    if (orderValue < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Giá trị đơn hàng phải đạt ít nhất ${coupon.minOrderValue} VND để áp dụng mã giảm giá này.`,
      });
    }

    let discountAmount = (orderValue * coupon.discount) / 100;
    if (discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    res.status(200).json({
      message: "Áp dụng mã giảm giá thành công.",
      couponId: coupon._id,
      discountAmount: discountAmount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi áp dụng mã giảm giá.", error });
  }
};

export {
  createCoupon,
  getCoupons,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
