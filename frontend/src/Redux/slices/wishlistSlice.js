import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Retrieve wishlist from local storage if available
const wishlistFromStorage = localStorage.getItem("wishlistItems")
  ? JSON.parse(localStorage.getItem("wishlistItems"))
  : [];

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: wishlistFromStorage, // Initialize with data from local storage if present
  },
  reducers: {
    addToWishlist: (state, action) => {
      const itemExists = state.wishlist.find(
        (item) => item._id === action.payload._id
      );

      if (!itemExists) {
        state.wishlist.push(action.payload);
        toast.success("Added to wishlist!");
      } else {
        toast.error("Item already in wishlist!");
      }

      // Update local storage
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(
        (item) => item._id !== action.payload._id
      );

      toast.success("Removed from wishlist!");

      // Update local storage fadsf
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    },
  },
});

// Export actions
export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;

// Export reducer
export default wishlistSlice.reducer;
