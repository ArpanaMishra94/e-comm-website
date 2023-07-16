import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const cartItemsFromStorage = localStorage.getItem("cart");
const initialState = cartItemsFromStorage
	? JSON.parse(cartItemsFromStorage)
	: { cartItems: [] };

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, action) => {
			const item = action.payload;

			const existItem = state.cartItems.find(
				(x: { _id: string }) => x._id === item._id
			);

			if (existItem) {
				state.cartItems = state.cartItems.map((x: { _id: string }) =>
					x._id === existItem._id ? item : x
				);
			} else {
				state.cartItems = [...state.cartItems, item];
			}

			return updateCart(state);
		},
	},
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
