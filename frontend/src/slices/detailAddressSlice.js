import { createSlice } from "@reduxjs/toolkit";
const initialState = localStorage.getItem("address") ? JSON.parse (localStorage.getItem("address")): {detailAddress: []};

const detailAddressSlice = createSlice({
    name: "address",
    initialState,
    reducers : {
        addToDetailAddress: (state, action)=>{
            const item = action.payload
            const existItem= state.detailAddress.find((x) =>x._id===item._id)
            if(existItem){
                state.detailAddress = state.detailAddress.map((x) => x._id === existItem._id ? item : x );
            } else {
                state.detailAddress = [ ...state.detailAddress,item];
            }
            localStorage.setItem('address', JSON.stringify(state));
            
        },
        removeFromDetailAddress: (state, action) => {
            state.detailAddress = state.detailAddress.filter((x) => x._id !== action.payload);
            // localStorage.removeItem('address')  
        }
        
    }
    
});
export const {addToDetailAddress, removeFromDetailAddress} = detailAddressSlice.actions;
export default detailAddressSlice.reducer