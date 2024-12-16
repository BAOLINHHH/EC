import { createSlice } from "@reduxjs/toolkit";
const initialState = localStorage.getItem("product") ? JSON.parse (localStorage.getItem("product")): {detailProduct: []};

const detailProductSlice = createSlice({
    name: "product",
    initialState,
    reducers : {
        addToDetailProduct: (state, action)=>{
            const item = action.payload
            const existItem= state.detailProduct.find((x) =>x._id===item._id)

            if(existItem){
                state.detailProduct = state.detailProduct.map((x) => x._id === existItem._id ? item : x );
            } else {
                state.detailProduct = [ ...state.detailProduct,item];
            }
            localStorage.setItem('product', JSON.stringify(state));
            
        },
        removeFromDetailProduct: (state, action) => {
            state.detailProduct = state.detailProduct.filter((x) => x._id !== action.payload);
        },
        
    }
    
});
export const {addToDetailProduct, removeFromDetailProduct} = detailProductSlice.actions;
export default detailProductSlice.reducer