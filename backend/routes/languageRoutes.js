
import express from 'express';
import {
    createLanguage,
    getLanguages,
    getLanguageById,
    updateLanguage,
    deleteLanguage,
} from '../controllers/languageController.js';

const router = express.Router();

router.post('/', createLanguage);
router.get('/', getLanguages);
router.get('/:id', getLanguageById);
router.put('/:id', updateLanguage);
router.delete('/:id', deleteLanguage);

export default router;