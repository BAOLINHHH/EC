import { createSlice } from "@reduxjs/toolkit";
const initialState = localStorage.getItem("favorite") ? JSON.parse (localStorage.getItem("favorite")): {favoriteItems: []};

const favoriteSlice = createSlice({
    name: "favorite",
    initialState,
    reducers : {
        addToFavorite: (state, action)=>{
            const item = action.payload
            const existItem= state.favoriteItems.find((x) =>x._id===item._id)

            if(existItem){
                state.favoriteItems = state.favoriteItems.map((x) => x._id === existItem._id ? item : x );
            } else {
                state.favoriteItems = [ ...state.favoriteItems,item];
            }
            localStorage.setItem('favorite', JSON.stringify(state));
            
        },
        removeFromFavorite: (state, action) => {
            state.favoriteItems = state.favoriteItems.filter((x) => x._id !== action.payload);
        },
        
    }
    
});
export const {addToFavorite, removeFromFavorite} = favoriteSlice.actions;
export default favoriteSlice.reducer