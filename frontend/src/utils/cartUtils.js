export const addDecimals = (num) =>{
    return (Math.round(num *100) / 100).toFixed(2); 
};

export const updateCart =  (state) => {
    state.itemsPrice = addDecimals( state.cartItems.reduce((acc,item) => acc + item.bookPrice * item.qty,0));
    state.itemsShip = addDecimals(state.itemsPrice > 300000 ? 15000 : 30000 )
    state.totalPrice= (
        Number(state.itemsPrice)+
        Number(state.itemsShip)
        ).toFixed(2)
        localStorage.setItem('cart',JSON.stringify(state));
    return state;
}