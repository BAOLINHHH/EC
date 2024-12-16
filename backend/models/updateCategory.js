import mongoose from 'mongoose';
import Product from './productModel.js';

const updateCategory = async () => {
  try {
    await mongoose.connect('mongodb+srv://baolinh:baolinh1234@cluster0.jir1n7o.mongodb.net/bookstore');

    // Ensure the ObjectId is instantiated correctly
    const newCategoryId = new mongoose.Types.ObjectId("6588755a729ea315f9f8dbb8");

    await Product.updateMany(
      { category: "Tiểu thuyết" },
      { $set: { category: newCategoryId } }
    );

    console.log("Category updated successfully");
  } catch (error) {
    console.error("Error updating category:", error);
  } finally {
    mongoose.connection.close();
  }
};

updateCategory();