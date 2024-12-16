import axios from "./axios";
const statsApi = {
  getStatsPurchases(params) {
    const url = `stats/purchases`;
    // Phân giải params thành query string
    const queryString = new URLSearchParams(params).toString();

    // Thêm query string vào URL
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return axios.get(fullUrl);
  },
  getCountDashboard() {
    const url = `stats/countDashboard`;
    return axios.get(url);
  },
};
export default statsApi;
