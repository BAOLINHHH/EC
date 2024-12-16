import axios from "axios"
import { getToken } from "../utils/authToken";
const instance=axios.create({
    baseURL :'https://book-store-ob7w.onrender.com/api',
    headers:{
      'Content-Type': 'application/json',
  },
    // timeout: 2000,
});



// Add a request interceptor
instance.interceptors.request.use( (config)=> {
    // Do something before request is sent
    const token = getToken();
 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });



export default instance