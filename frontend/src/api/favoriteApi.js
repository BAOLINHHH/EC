import axios  from "./axios";
const favoriteApi={
    addFavorite(productId){
        const url = `wishlist` 
        return axios.post(url,{productId})
    },
    checkFavorite(id){
        const url = `wishlist/product/${id}`
        return axios.get(url)
    },
    deleteFavorite(id){
        const url= `wishlist/${id}`
        return axios.delete(url);
    },
    getAllFavorite(){
        const url = `wishlist`
        return axios.get(url)
    }

};
export default favoriteApi;