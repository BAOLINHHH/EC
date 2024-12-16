import { create } from "@mui/material/styles/createTransitions";
import axios from "./axios";
        
const listProduct = {
  getAllNewProducts(category) {
        const url = `products/latest?category=${category}`;
    return axios.get(url);
    },
  createReview(id, data) {
    const url = `products/${id}/reviews`;
    return axios.post(url, data);
    },
  getAllAdminProduct(pageNumber) {
    const url = `products/admin?pageNumber=${pageNumber}`;
    return axios.get(url);
    },
  getAllProducts(
    keyword,
    pageNumber,
    category,
    publicCompany,
    minPrice,
    maxPrice,
    form,
    language,
    rate
  ) {
    const url = `products?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}&publicCompany=${publicCompany}&minPrice=${minPrice}&maxPrice=${maxPrice}&form=${form}&language=${language}&rate=${rate}`;
    return axios.get(url);
  },
  getProductDetail(productId) {
    const url = `products/${productId}`;
    return axios.get(url);
  },
  getTopRatedProducts() {
    const url = "products/toprated";
    return axios.get(url);
  },
  getBestSaleProducts() {
    const url = "products/topsellers";
    return axios.get(url);
  },
  getEbookProducts() {
    const url = "products/ebooks";
    return axios.get(url);
  },
  addToFavorite() {
    const url = "wishlist";
    return axios.post(url);
  },
  createProduct(data) {
    const url = "products";
    return axios.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadImg(data) {
    const url = "upload/file";
    return axios.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateProduct(id, data) {
    const url = `products/${id}`;
    return axios.put(url, data);
  },
  deleteProduct(id) {
    const url = `products/${id}`;
    return axios.delete(url);
  },
};
export default listProduct;
