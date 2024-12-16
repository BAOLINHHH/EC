import express from 'express';
import {
    createForm,
    getForms,
    getFormById,
    updateForm,
    deleteForm,
} from '../controllers/formController.js';

const router = express.Router();

// Tạo mới form
router.post('/', createForm);

// Lấy danh sách tất cả các form
router.get('/', getForms);

// Lấy thông tin form theo ID
router.get('/:id', getFormById);

// Cập nhật form theo ID
router.put('/:id', updateForm);

// Xóa form theo ID
router.delete('/:id', deleteForm);

export default router;
