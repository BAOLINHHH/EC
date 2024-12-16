

import axios  from "./axios";

const couponApi =  {
 
    getAll(){
        const url = 'coupon'
        return axios.get(url);
    },
    create(data){
        const url ='coupon/create'
        return axios.post(url,data)
    },
    update(id, data){

        const url = `coupon/${id}`
        return axios.put(url,data)
    },
    delete(id){
        const url = `coupon/${id}`
        return axios.delete(url)
    },
    applyCoupon(data){
        const url = `coupon/apply`
        return axios.post(url, data)
    }
};
export default couponApi

