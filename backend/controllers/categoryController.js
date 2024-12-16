import Category from "../models/categoryModel.js";

// @desc     Create category
// @route    POST api/categories
// @access   Public
const createCategory = async (req, res) => {
  try {
    if (!req.body.categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Miss Input" });
    }
    const category = new Category({
      categoryName: req.body.categoryName,
      categoryImage: req.file.image,
    });

    await category.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc     Get all category
// @route    GET api/categories
// @access   Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc     Get category by ID
// @route    GET api/categories/:id
// @access   Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc     Update category by ID
// @route    PUT api/categories/:id
// @access   Public
const updateCategory = async (req, res) => {
  try {
    const { categoryName, categoryImage } = req.body;
    const firebaseUrl = req.file.image;
    // Tìm kiếm category
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Chỉ cập nhật những thuộc tính có trong request body
    if (categoryName) category.categoryName = categoryName;
    // Nếu có file ảnh mới, cập nhật firebaseUrl vào categoryImage
    if (firebaseUrl) {
      category.categoryImage = firebaseUrl;
    }

    // Lưu kết quả cập nhật
    await category.save();

    // Trả về kết quả sau khi cập nhật
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc     Delete category by ID
// @route    DELETE api/categories/:id
// @access   Public
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};