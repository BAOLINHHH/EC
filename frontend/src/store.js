import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import  cartSliceReducer from "./slices/cartSlice"
import authSliceReducer from "./slices/authSlice";
import favoriteReducer from "./slices/favoriteSlice";
import detailProductReducer from  "./slices/detailProductSlice";
import detailAddressReducer from "./slices/detailAddressSlice";
const store = configureStore({
    reducer: {
        [ apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer,
        auth: authSliceReducer,
        favorite: favoriteReducer,
        product: detailProductReducer,
        address: detailAddressReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});
export default store;