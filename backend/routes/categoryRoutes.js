import express from "express";
import uploadCloud from "../config/firebaseConfig.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", uploadCloud("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", uploadCloud("image"), updateCategory);
router.delete("/:id", deleteCategory);

export default router;