import { CART_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    syncCart: builder.mutation({
      query: (cartData) => ({
        url: CART_URL,
        method: "POST",
        body: cartData,
      }),
      invalidatesTags: ["Cart"], // Invalidate cart data after syncing
    }),
    fetchCart: builder.query({
      query: (userId) => `${CART_URL}/${userId}`,
      providesTags: ["Cart"], // Provide the cart data for caching
    }),
  }),
});

export const { useSyncCartMutation, useFetchCartQuery } = cartApiSlice;
