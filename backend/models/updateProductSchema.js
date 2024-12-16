import mongoose from 'mongoose';
import Product from './productModel.js';

const updateProducts = async () => {
  try {
    await mongoose.connect('mongodb+srv://baolinh:baolinh1234@cluster0.jir1n7o.mongodb.net/bookstore', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.updateMany({}, { $set: { quantity: 100, pdfUrl: "", audioUrl: "" } });
    console.log('Schema updated successfully');
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    mongoose.connection.close();
  }
};

updateProducts();