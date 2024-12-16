import axiosGHN from './axiosGHN'

const ghnApi = {
    getProvince: async()=>{
        try {
            const url = 'master-data/province';
            const response = await axiosGHN.get(url);
            return response.data;
        } catch (error) {
            console.log("flech dataprovince err")
            return null
        }
    },
    getDistrict: async(provinceId)=>{
        try {
            const url = 'master-data/district';
            const response = await axiosGHN.post(url,provinceId);
            return response.data;
        } catch (error) {
            console.log("flech datadistrict err")
            return null
        }
    },
    getWard: async(WardId)=>{
        try {
            const url = 'master-data/ward';
            const response = await axiosGHN.post(url,WardId);
            return response.data;
        } catch (error) {
            console.log("flech dataward err")
            return null
        }
    },
    getFeeShip: async(data) =>{
        try {
            const url = 'v2/shipping-order/fee';
            const response = await axiosGHN.post(url,data);
            return response.data;
        } catch (error) {
            console.log("flech data err")
            return null
        }
    }
}
export default ghnApi;