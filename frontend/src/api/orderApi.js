import axios from "./axios";
const orderApi = {
  getOrder(params) {
    const url = `orders`;
  
    // Phân giải params thành query string
    const queryString = new URLSearchParams(params).toString(); 
  
    // Thêm query string vào URL
    const fullUrl = queryString ? `${url}?${queryString}` : url;
  
    return axios.get(fullUrl);
  },
  createOrders(data) {
    const url = "orders";
    return axios.post(url, data);
  },
  getOrderById(orderId) {
    const url = `orders/${orderId}`;
    return axios.get(url);
  },
  getMyOrders(params) {
    const url = `orders/mine`;
  
    // Phân giải params thành query string
    const queryString = new URLSearchParams(params).toString(); 
  
    // Thêm query string vào URL
    const fullUrl = queryString ? `${url}?${queryString}` : url;
  
    return axios.get(fullUrl);
  },
  getMyEbookOrders(params) {
    const url = `orders/ebooks`;
  
    // Phân giải params thành query string
    const queryString = new URLSearchParams(params).toString(); 
  
    // Thêm query string vào URL
    const fullUrl = queryString ? `${url}?${queryString}` : url;
  
    return axios.get(fullUrl);
  },
  updateOrderToPaid(orderId) {
    const url = `orders/${orderId}/pay`;
    return axios.put(url);
  },
  createPaymentUrlVNPay(data) {
    const url = "orders/create_payment_url";
    return axios.post(url, data);
  },
  updateOrderStatus(data) {
    const url = "orders/updateOrderStatus";
    return axios.put(url, data);
  },
  updateOrderStatusUser(data) {
    const url = "orders/updateOrderStatusUser";
    return axios.put(url, data);
  },
  cancelOrder(data) {
    const url = "orders/cancelOrder";
    return axios.post(url, data);
  },
};
export default orderApi;
