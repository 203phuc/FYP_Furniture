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
    }),
    fetchCart: builder.query({
      query: (userId) => `${CART_URL}/${userId}`,
    }),
  }),
});

export const { useSyncCartMutation, useFetchCartQuery } = cartApiSlice;
