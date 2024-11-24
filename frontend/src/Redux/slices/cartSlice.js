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
      const { variantId, quantity } = action.payload;

      const itemIndex = state.cart.items.findIndex(
        (item) => item.variantId === variantId
      );
      if (itemIndex !== -1) {
        const existingItem = state.cart.items[itemIndex];
        console.log(JSON.stringify(existingItem));
        console.log(action.payload);
        if (
          state.cart.items[itemIndex].quantity >
          state.cart.items[itemIndex].stockQuantity
        ) {
          console.log("stock quantity exceeded");
          return;
        }
        // Update quantity for existing item
        if (
          state.cart.items[itemIndex].quantity + quantity >
          state.cart.items[itemIndex].stockQuantity
        ) {
          console.log("stock quantity exceeded");
          return;
        } else {
          state.cart.items[itemIndex].quantity += action.payload.quantity;
        }
      } else {
        // Ensure user_id and createdAt are set
        state.user_id = action.payload.user_id;
        state.createdAt = action.payload.createdAt;

        // Check if payload contains an array of items
        if (Array.isArray(action.payload.items)) {
          // Add each item from the payload to the cart
          action.payload.items.forEach((item) => {
            state.cart.items.push({ ...item });
          });
        } else {
          console.error("Invalid payload format: 'items' is not an array.");
        }
      }
      // Sync to local storage
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    removeFromCart: (state, action) => {
      // Filter out the item by variantId
      state.cart.items = state.cart.items.filter(
        (item) => item.variantId !== action.payload
      );

      // Sync to local storage
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    clearCart: (state) => {
      state.cart = { items: [] };
      localStorage.removeItem("cart");
    },

    updateCart: (state, action) => {
      // Replace the entire cart items
      state.cart.items = action.payload;

      // Sync to local storage
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateCart } =
  cartSlice.actions;
export default cartSlice.reducer;
