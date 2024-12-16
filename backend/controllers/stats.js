import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js"; // Path to your Order model
import User from "../models/userModel.js"; // Đường dẫn tới file chứa User schema
import Product from "../models/productModel.js"; // Đường dẫn tới file chứa User schema
import Coupon from "../models/couponModel.js"; // Đường dẫn tới file chứa User schema

// @desc    Get book purchase statistics by month and year
// @route   GET /api/stats/purchases?month=11&year=2024
// @access  Private/Admin
const getBookPurchaseStats = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    res.status(400);
    throw new Error("Month and Year are required");
  }

  const monthNumber = parseInt(month);
  const yearNumber = parseInt(year);

  // Tính ngày đầu tháng và ngày cuối tháng
  const startOfMonth = new Date(yearNumber, monthNumber - 1, 1); // Ngày đầu tháng
  const endOfMonth = new Date(yearNumber, monthNumber, 0, 23, 59, 59, 999); // Ngày cuối tháng

  try {
    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth, // Ngày đầu tháng
            $lt: endOfMonth, // Ngày cuối tháng
          },
        },
      },
      { $unwind: "$orderItems" }, // Phân tách các mục trong orderItems
      {
        $lookup: {
          from: "products", // Tên collection products
          localField: "orderItems.product", // Trường product trong orderItems
          foreignField: "_id", // Trường _id trong collection products
          as: "productDetails", // Kết quả trả về sẽ nằm trong trường productDetails
        },
      },
      { $unwind: "$productDetails" }, // Giải nén productDetails để truy cập category
      {
        $lookup: {
          from: "categories", // Tên collection categories
          localField: "productDetails.category", // Trường category trong productDetails
          foreignField: "_id", // Trường _id trong collection categories
          as: "categoryDetails", // Kết quả trả về sẽ nằm trong trường categoryDetails
        },
      },
      { $unwind: "$categoryDetails" }, // Giải nén categoryDetails để lấy categoryName
      {
        $group: {
          _id: "$categoryDetails._id", // Nhóm theo _id của category
          categoryName: { $first: "$categoryDetails.categoryName" }, // Lấy categoryName
          totalQty: { $sum: "$orderItems.qty" }, // Tính tổng số lượng bán ra
        },
      },
      { $sort: { totalQty: -1 } }, // Sắp xếp theo tổng số lượng giảm dần
    ]);

    res.status(200).json({
      month: monthNumber,
      year: yearNumber,
      data: stats.map((stat) => ({
        categoryName: stat.categoryName, // Trả về tên category
        totalQty: stat.totalQty, // Trả về tổng số lượng
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch statistics", error });
  }
});

// @desc    Get count all systems
// @route   GET /api/stats/countDashboard
// @access  Private/Admin
const getCountDashboard = asyncHandler(async (req, res) => {
  try {
    // Đếm số lượng người dùng không phải admin
    const userCount = await User.countDocuments({ isAdmin: false });

    // Thống kê tổng doanh thu bán được
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Đơn hàng đã được giao", // Chỉ chọn các đơn hàng đã giao
        },
      },
      {
        $group: {
          _id: null, // Không nhóm theo trường nào
          totalRevenue: { $sum: "$totalPrice" }, // Tổng cộng trường totalPrice
        },
      },
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;

    // Đếm tổng số lượng SP hiện có
    const totalProducts = await Product.countDocuments();

    // Đếm tổng số lượng mã giảm giá hiện có
    const totalCoupons = await Coupon.countDocuments();

    // Đếm tổng số lượng hóa đơn hiện có
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount,
        totalRevenue: revenue,
        totalProducts,
        totalCoupons,
        totalOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to count users",
      error: error.message,
    });
  }
});

export { getBookPurchaseStats, getCountDashboard };
