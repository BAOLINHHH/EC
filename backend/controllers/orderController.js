import dotenv from "dotenv";
dotenv.config();
import querystring from "qs";
import crypto from "crypto";
import dateFormat from "dateformat";
import moment from "moment";

import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import UsedCoupon from "../models/couponUsage.js";

// import { calcPrices } from '../utils/calcPrices.js';
// import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc     Create new order
// @route    POST /api/orders
// @access   Private
// const addOrderItems = asyncHandler (async (req, res)=> {
//     const {
//         orderItems,
//         shippingAddress,
//         paymentMethod,
//         itemsPrice,
//         shippingPrice,
//         totalPrice,
//     } = req.body;

//     if (orderItems && orderItems.length === 0){
//         res.status(400);
//         throw new Error('No order items');
//     } else {
//         // // get the ordered items from our database
//         // const itemsFromDB = await Product.find({
//         //     _id: { $in: orderItems.map((x) => x._id) },
//         // });

//         // // map over the order items and use the price from our items from database
//         // const dbOrderItems = orderItems.map((itemFromClient) => {
//         //     const matchingItemFromDB = itemsFromDB.find(
//         //         (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
//         //     );
//         //     return {
//         //     ...itemFromClient,
//         //     product: itemFromClient._id,
//         //     price: matchingItemFromDB.price,
//         //     _id: undefined,
//         //     };
//         // });

//         // calculate prices
//         // const { itemsPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

//         const order = new Order ({
//             orderItems: orderItems.map((x) => ({
//                 ...x,
//                 product: x._id,
//                 _id: undefined
//             })),
//             // orderItems: dbOrderItems,
//             user: req.user._id,
//             shippingAddress,
//             paymentMethod,
//             itemsPrice,
//             shippingPrice,
//             totalPrice,
//         });
//         const createdOrder = await order.save();

//         res.status(201).json(createdOrder);
//     }
// });

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    discountAmount,
    totalPrice,
    couponId,
    ebook,
  } = req.body;

  const isEbook = ebook;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    if (ebook === false) {
      // Lấy sản phẩm từ database dựa trên orderItems
      const itemsFromDB = await Product.find({
        _id: { $in: orderItems.map((x) => x._id) },
      });

      // Kiểm tra và cập nhật số lượng sản phẩm
      for (const itemFromClient of orderItems) {
        const matchingItemFromDB = itemsFromDB.find(
          (itemFromDB) => (itemFromDB) =>
            itemFromDB._id.toString() === itemFromClient._id
        );

        if (!matchingItemFromDB) {
          res.status(404);
          throw new Error(`Product with ID ${itemFromClient._id} not found`);
        }

        // Kiểm tra số lượng còn lại
        if (isNaN(itemFromClient.qty) || itemFromClient.qty <= 0) {
          res.status(400);
          throw new Error("Invalid quantity");
        }

        if (matchingItemFromDB.quantity < itemFromClient.qty) {
          res.status(400);
          throw new Error(
            `Rất tiếc, chúng tôi không đủ số lượng sản phẩm "${matchingItemFromDB.bookName}" trong kho để thực hiện đơn hàng của bạn. Hiện tại chỉ (còn ${matchingItemFromDB.quantity} sản phẩm).`
          );
        }

        // Trừ số lượng sản phẩm
        // console.log("Before update:", matchingItemFromDB.quantity);
        matchingItemFromDB.quantity -= itemFromClient.qty;
        // console.log("After update:", matchingItemFromDB.quantity);
        await matchingItemFromDB.save({ validateModifiedOnly: true });
      }
    }

    // Tạo đối tượng đơn hàng mới
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discountAmount,
      totalPrice,
      couponId,
      isEbook,
    });

    // Lưu đơn hàng để có `_id`
    const createdOrder = await order.save();

    // Tạo mã vận đơn: <Ngày thanh toán><Số lượng sản phẩm>_<ObjectID>
    const trackingCode = `${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}${orderItems.length}_${createdOrder._id}`;
    createdOrder.trackingCode = trackingCode;

    await createdOrder.save();

    // Nếu có couponId, lưu thông tin vào UsedCoupon
    if (couponId) {
      const createUsedCoupon = new UsedCoupon({
        userId: req.user._id,
        couponId,
      });

      await createUsedCoupon.save();
    }

    res.status(201).json(createdOrder);
  }
});

// @desc     Get logged in user orders
// @route    GET /api/orders/mine
// @access   Private
const getMyOrders = asyncHandler(async (req, res) => {
  // Lấy các tham số phân trang từ query string, mặc định page = 1 và pageSize = 10
  const page = parseInt(req.query.page) || 1; // Trang hiện tại
  const pageSize = parseInt(req.query.pageSize) || 10; // Số lượng đơn hàng trên mỗi trang

  // Tính toán số lượng đơn hàng cần bỏ qua
  const skip = (page - 1) * pageSize;

  // Tổng số đơn hàng của người dùng
  const totalOrders = await Order.countDocuments({ user: req.user._id });

  // Lấy dữ liệu đơn hàng với phân trang
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo (mới nhất trước)
    .skip(skip)
    .limit(pageSize);

  // Trả về kết quả với thông tin phân trang
  res.status(200).json({
    success: true,
    page,
    pageSize,
    totalPages: Math.ceil(totalOrders / pageSize),
    totalOrders,
    orders,
  });
});

// API lấy danh sách eBooks theo userId
const getEbookOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1; // Trang hiện tại, mặc định là 1
  const pageSize = Number(req.query.pageSize) || 10; // Số bản ghi mỗi trang, mặc định là 10

  const count = await Order.countDocuments({
    isEbook: true,
    user: req.user._id,
  }); // Tổng số eBooks cho user
  const orders = await Order.find({ isEbook: true, user: req.user._id })
  .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo (mới nhất trước)
    .skip(pageSize * (page - 1)) // Bỏ qua các bản ghi của các trang trước
    .limit(pageSize); // Lấy số bản ghi của trang hiện tại

  res.status(200).json({
    orders,
    page,
    pageSize,
    total: count,
    totalPages: Math.ceil(count / pageSize),
  });
});

// @desc     Get order by ID
// @route    GET /api/orders/:id
// @access   Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc     Update Order to Paid
// @route    PUT /api/orders/:id/pay
// @access   Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // // NOTE: here we need to verify the payment was made to PayPal before marking
  // // the order as paid
  // const { verified, value } = await verifyPayPalPayment(req.body.id);
  // if (!verified) throw new Error('Payment not verified');

  // // check if this transaction has been used before
  // const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  // if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);

  if (order) {
    // // check the correct amount was paid
    // const paidCorrectAmount = order.totalPrice.toString() === value;
    // if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
    };

    const updateOrder = await order.save();

    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc     Get all orders
// @route    GET /api/orders
// @access   Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // Default values for page and pageSize

  // Convert to numbers since query params are strings by default
  const pageNumber = Number(page);
  const pageSizeNumber = Number(pageSize);

  // Calculate the number of documents to skip
  const skip = (pageNumber - 1) * pageSizeNumber;

  // Fetch orders with pagination
  const orders = await Order.find({})
  .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo (mới nhất trước)
    .populate("user", "id name")
    .skip(skip)
    .limit(pageSizeNumber);

  // Get total count of orders for pagination metadata
  const totalOrders = await Order.countDocuments();

  res.status(200).json({
    orders,
    pagination: {
      currentPage: pageNumber,
      pageSize: pageSizeNumber,
      totalOrders,
      totalPages: Math.ceil(totalOrders / pageSizeNumber),
    },
  });
});

// @desc     Get tracking
// @route    GET /api/orders/tracking/:trackingCode
// @access   Public
const getOrderByTrackingCode = asyncHandler(async (req, res) => {
  const { trackingCode } = req.params;

  // Tìm kiếm đơn hàng dựa trên trackingCode
  const order = await Order.findOne({ trackingCode })
    .populate("user", "name email") // Lấy thông tin người dùng (nếu cần)
    .populate("orderItems.product", "name price"); // Lấy thêm thông tin sản phẩm (nếu cần)

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order); // Trả về thông tin đơn hàng
});

// @desc     create payment url
// @route    POST /api/orders/create_payment_url
// @access   Privie
const createPaymentUrl = asyncHandler(async (req, res) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = process.env.VNP_TMNCODE;
  let secretKey = process.env.VNP_HASHSECRET;
  let vnpUrl = process.env.VNP_URL;
  let returnUrl = process.env.VNP_RETURNURL;
  let orderId = moment(date).format("DDHHmmss");
  let amount = req.body.amount;
  let orderInfo = req.body.orderDescription;

  // let bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = "topup"; //other
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  // if (bankCode !== null && bankCode !== "") {
  //   vnp_Params["vnp_BankCode"] = bankCode;
  // }

  vnp_Params = sortObject(vnp_Params);

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  // console.log(vnpUrl); // Log URL cuối cùng
  // res.redirect(vnpUrl);
  res.status(200).json({ vnpUrl });
});

const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

// @desc     update Order Status
// @route    POST /api/orders/updateOrderStatus
// @access   Privie
const updateOrderStatus = async (req, res) => {
  const { orderId, newStatus } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.orderStatus = newStatus;
  await order.save();

  res.json(order);
};

// @desc     cancel order
// @route    POST /api/orders/cancelOrder
// @access   Privie
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId, cancelReason } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Kiểm tra nếu đơn hàng đã giao thì không thể hủy
  if (order.isDelivered) {
    res.status(400);
    throw new Error("Delivered orders cannot be canceled");
  }

  // Cập nhật trạng thái hủy
  order.orderStatus = "Đã hủy";
  order.cancelReason = cancelReason || "No reason provided";
  order.canceledAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order has been canceled",
    order,
  });
});

const checkEbookPermission = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    res.status(400);
    throw new Error("ProductId are required");
  }

  // Tìm đơn hàng khớp với userId, productId và isEbook = true
  const order = await Order.findOne({
    user: req.user._id,
    isEbook: true,
    "orderItems.product": productId,  // Kiểm tra sản phẩm trong orderItems
  });


  if (order) {
    res.status(200).json({ exists: true, order });
  } else {
    res
      .status(404)
      .json({
        exists: false,
        message: "You do not have permission to read this file.",
      });
  }
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getOrderByTrackingCode,
  createPaymentUrl,
  updateOrderStatus,
  cancelOrder,
  getEbookOrders,
  checkEbookPermission,
};
