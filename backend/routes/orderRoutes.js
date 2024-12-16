import express from "express";
const router = express.Router();
import { 
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
    checkEbookPermission
 } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.get("/ebooks", protect, getEbookOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.get("/tracking/:trackingCode", getOrderByTrackingCode);
router.post("/create_payment_url", protect, createPaymentUrl);
router.put("/updateOrderStatus", protect, admin, updateOrderStatus);
router.put("/updateOrderStatusUser", protect, updateOrderStatus);

router.post("/cancelOrder", protect, admin, cancelOrder);

router.route('/check_ebook_permission/:productId').get(protect, checkEbookPermission);

export default router;