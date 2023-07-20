import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const cartItemsFromStorage = localStorage.getItem("cart");
const initialState = cartItemsFromStorage
	? JSON.parse(cartItemsFromStorage)
	: { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

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
		removeFromCart: (state, action) => {
			state.cartItems = state.cartItems.filter(
				(x: { _id: string }) => x._id !== action.payload
			);
			return updateCart(state);
		},
		saveShippingAddress: (state, action) => {
			state.shippingAddress = action.payload;
			return updateCart(state);
		},
	},
});

export const { addToCart, removeFromCart, saveShippingAddress } =
	cartSlice.actions;

export default cartSlice.reducer;
