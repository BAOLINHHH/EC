import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryImage: {
    type: String,
    required: false,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
