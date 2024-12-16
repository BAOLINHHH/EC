import express from "express";
const router = express.Router();
import { 
    authUser,
    //registerUser,
    registerAndVerifyUser,
    logoutUser,
    getUserProfile,
    //updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    sendOtpByEmail,
    //verifyOtp,
    forgotPassword,
    resetPassword,
    changePassword
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerAndVerifyUser).get(protect, admin, getUsers);
router.route('/send-otp').post(sendOtpByEmail);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/change-password').put(protect, changePassword);
//router.route('/verify-otp').post(verifyOtp);
router.post('/logout', logoutUser);
router.post('/auth', authUser);
//router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser);

export default router;