import axios  from "./axios";
const cartApi={
    add(data){
        const url = 'cart' 
        console.log("dataCart", data)
        return axios.post(url,data);    
    }

};
export default cartApi;