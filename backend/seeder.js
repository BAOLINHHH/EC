import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import User from "./models/userModel.js";
import Order from "./models/orderModel.js";
import Form from "./models/formModel.js";
import forms from "./data/forms.js";
import PublicCompany from "./models/publicCompanyModel.js";
import publicCompanies from "./data/publicCompanies.js";
import products from "./data/products.js";
import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";
import categories from "./data/categories.js";
import Author from "./models/authorModel.js";
import authors from "./data/authors.js";

import connectDB from "./config/db.js";

dotenv.config();

await connectDB();
const importData = async() => {
    try{
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        await Author.deleteMany();
        await Form.deleteMany();
        await PublicCompany.deleteMany();

        const createUsers = await User.insertMany(users);
        
        const adminUser = createUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return {...product, user: adminUser};
        });
        
        await Product.insertMany(sampleProducts);
        await Category.insertMany(categories);
        await Author.insertMany(authors);
        await Form.insertMany(forms);
        await PublicCompany.insertMany(publicCompanies);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch(error){
        console.error(error);
        process.exit(1);
    }
};

const destroyData = async() => {
    try{
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        await Author.deleteMany();
        await Form.deleteMany();
        await PublicCompany.deleteMany();

        console.log('Data Destroyed!'.green.inverse);
        process.exit();
    } catch(error){
        console.error(error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d'){
    destroyData();
}
else{
    importData();
}