
import ChangePassword from "../screens/ChangePasswordScreen";
import { logout } from "../slices/authSlice";
import axios  from "./axios";
const userApi={
    loginUser(data){
        const url = 'users/auth' 
        return axios.post(url,data)
       .then(response =>{
        console.log('Response from server: ', response); // Logs the response body
            return response;  // Return only the response body
       })
    },
    getAll(){
        const url = 'users'
        return axios.get(url);
    },
    updata(id, data){
        const url = `users/${id}`
        return axios.put(url,data);
    },
    delete(id){
        const url = `users/${id}`
        return axios.delete(url)
    },
    logout(){
        const url = 'users/logout'
        return axios.post(url);
    },
    registerUser(data){
        const url = 'users'
        return axios.post(url,data);
    },
    sendOtp(email){
        const url = 'users/send-otp'
        return axios.post(url,email)
    },
    verifyOtp(data){
        const url = 'users/verify-otp'
        return axios.post(url,data)
    },
    ChangePassword(data){
        const url = 'users/change-password'
        return axios.put(url,data)
    },
    forgetWord(email){
        const url = 'users/forgot-password'
        return axios.post(url,email)
    },
    resetPassword(data){
        const url = 'users/reset-password'
        return axios.post(url,data)
    }
};
export default userApi;