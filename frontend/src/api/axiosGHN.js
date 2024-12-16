import axios from "axios"

const tokenApi = '75d0468f-9ff9-11ef-a804-e2ccc85641ed'
const instanceGHN=axios.create({
    baseURL :'https://online-gateway.ghn.vn/shiip/public-api/',
    headers:{
        'Token': tokenApi,
        'Content-Type': 'application/json',
    }
});
// Add a request interceptor
instanceGHN.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instanceGHN.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });



export default instanceGHN