import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";
// const initialState = localStorage.getItem("cart") ? JSON.parse (localStorage.getItem("cart")): {cartItems: [],shippingAddress: {}, paymentMethhod: 'PayPal'};

const initialState = {
  isLoading: false,
  cartItems: [],
  shippingAddress: {},
    itemsPrice : 0,
    itemsShip:0,
    paymentMethod : "PayPal",
    totalPrice : 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethhod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      updateCart(state);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCartItems: (state, action) => {
      state.cartItems= action.payload.cartItems;
      state.shippingAddress= action.payload.shippingAddress;
      state.itemsPrice = action.payload.itemsPrice;
      state.itemsShip=action.payload.itemsShip;
      state.paymentMethod = action.payload.paymentMethod;
      state.totalPrice = action.payload.totalPrice;
      state.isLoading = false; // Set loading to false when data is loaded
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  setLoading,
  setCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;