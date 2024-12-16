

import axios  from "./axios";

const addressApi =  {
    update(data){
        const url = 'shippingaddress'
        return axios.post(url,data);
    },
    getAll(){
        const url = 'shippingaddress'
        return axios.get(url);
    },
    edit(id,data){
        const url = `shippingaddress/${id}`
        return axios.put(url,data);
    },
    detele(id){
        const url = `shippingaddress/${id}`
        return axios.delete(url);
    }
    
};
export default addressApi

