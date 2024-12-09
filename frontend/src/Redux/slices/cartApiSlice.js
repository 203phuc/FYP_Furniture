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
    deleteCart: builder.mutation({
      query: (userId) => ({
        url: `${CART_URL}/${userId}`,
        method: "DELETE",
      }),
      // Invalidate the cart data after deletion to trigger a re-fetch
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useSyncCartMutation,
  useFetchCartQuery,
  useDeleteCartMutation
} = cartApiSlice;
