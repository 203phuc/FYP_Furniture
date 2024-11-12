import { createSlice } from "@reduxjs/toolkit";

// Fetch the cart from local storage
const cartFromStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: cartFromStorage,
  },
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.cart.items.findIndex(
        (item) => item.variantId === action.payload.variantId
      );

      if (itemIndex === -1) {
        state.cart.items.push({ ...action.payload });
      } else {
        state.cart.items[itemIndex] = {
          ...state.cart.items[itemIndex],
          quantity:
            state.cart.items[itemIndex].quantity + action.payload.quantity,
        };
      }

      // Sync to local storage
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      state.cart.items = state.cart.items.filter(
        (item) => item.product_id !== action.payload
      );

      // Sync to local storage
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = { items: [] };
      localStorage.removeItem("cart");
    },
    updateCart: (state, action) => {
      state.cart.items = action.payload;
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateCart } =
  cartSlice.actions;
export default cartSlice.reducer;
