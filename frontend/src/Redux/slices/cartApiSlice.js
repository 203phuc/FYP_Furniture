import { apiSlice } from "./apiSlice.js";
import { CART_URL } from "../constants.jsx"; // Make sure CART_URL is defined in your constants

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: (userId) => ({
        url: `${CART_URL}/${userId}`,
        method: "GET",
      }),
    }),
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: `${CART_URL}`,
        method: "POST",
        body: cartData,
      }),
    }),
    updateCartItem: builder.mutation({
      query: ({ userId, productId, quantity }) => ({
        url: `${CART_URL}/${userId}/${productId}`,
        method: "PUT",
        body: { quantity },
      }),
    }),
    removeCartItem: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `${CART_URL}/${userId}/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApiSlice;
