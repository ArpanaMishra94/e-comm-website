import { createSlice } from "@reduxjs/toolkit";

const cartItemsFromStorage = localStorage.getItem("cart");
const initialState = cartItemsFromStorage
	? JSON.parse(cartItemsFromStorage)
	: { cartItems: [] };

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {},
});

export default cartSlice.reducer;
