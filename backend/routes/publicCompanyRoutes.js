import express from 'express';
import {
    createPublicCompany,
    getPublicCompanies,
    getPublicCompanyById,
    updatePublicCompany,
    deletePublicCompany,
} from '../controllers/publicCompanyController.js';

const router = express.Router();

// Tạo mới public company
router.post('/', createPublicCompany);

// Lấy danh sách tất cả public companies
router.get('/', getPublicCompanies);

// Lấy thông tin public company theo ID
router.get('/:id', getPublicCompanyById);

// Cập nhật public company theo ID
router.put('/:id', updatePublicCompany);

// Xóa public company theo ID
router.delete('/:id', deletePublicCompany);

export default router;